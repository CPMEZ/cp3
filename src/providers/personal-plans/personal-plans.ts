import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import CryptoJS from 'crypto-js';

import { CPAPI } from '../cpapi/cpapi';
import { AuthenticationProvider } from '../authentication/authentication';
import { LocalStoreProvider } from '../local-store/local-store';
import { MasterPlansProvider } from '../master-plans/master-plans';
import { ConnectionProvider } from '../connection/connection';

const STORAGE_KEY = 'plans';  // note CacheProvider ignores this key on clearCache
// user local data encrypted with common key because user may never log in, or subscribe
const LOCAL_ENCRYPT_KEY = 'Askance to watch the working of his lie';  // childe roland, 3rd line, browning 1855
// user web data encrypted with user's own key phrase


@Injectable()
export class PersonalPlansProvider {
  lastWrite: string;
  plans: {}[] = [];
  listSelection: any;  // used by merge, add-plan pages

  constructor(private http: HttpClient,
    public events: Events,
    public conn: ConnectionProvider,
    private LSP: LocalStoreProvider,
    public auth: AuthenticationProvider,
    private cpapi: CPAPI,
    public MPP: MasterPlansProvider) {
    console.log('Constructor PersonalPlansProvider Provider');
  }

  local: {};
  foundLocal: boolean = false;
  localAttemptComplete: boolean = false;
  web: {};
  foundWeb: boolean = false;
  webAttemptComplete: boolean = false;
  loadingNow: boolean = false;

  // .userLoggedIn determines if user can search from master

  loadPlans() {
    // clear out plans before reading,
    //    in case different user has signed in
    this.initPlans();


    // always get the local copy regardless of internet
    this.loadPlansLocal();
    if (this.auth.userLoggedIn) {
      // console.log('loadPlans logged in=', this.auth.userLoggedIn);
      // if we can, also get the web copy
      this.loadPlansWeb();
      this.checkRecent();  // use the most recent if we've read both web & local
    } else {
      // can't read the web
      // console.log('loadPlans (userLoggedIn- else path)');
      this.foundWeb = false;
      this.webAttemptComplete = true;
      this.checkRecent();  // let the standard logic choose local
      // this.plans = this.local["plans"];
    }
  }

  // add new plan
  addPlan(np: any, type: string) {
    // initialize the plan structure for a new one
    let newPlan: any;
    if (type === 'empty') {
      newPlan = { name: np.name, text: np.text, created: "", updated: "", problems: [] };
    } else { // type==='guided'
      newPlan = this.deepCopy(GUIDED_PLAN);
      newPlan.name = np.name;
      newPlan.text = np.text;
    }
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    // if (!this.plans) { this.initPlans(); }
    this.plans.push(newPlan);
    // console.log(this.plans);
    this.write();
  }

  // // add standard plan section
  standardPlan(np, condition) {
    // add a standard plan
    let newPlan: any;
    newPlan = { name: np.name, text: np.text, created: "", updated: "", problems: [] };
    if (newPlan.text === "") { newPlan.text = condition["text"]; }
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    this.MPP.getMaster(condition["file"])
      .then(data => {
        const cond: {} = JSON.parse(data);
        this.mergePlans(newPlan, cond);
        this.plans.push(newPlan);
        // console.log(this.plans);
        this.write();
      });
  }

  mergePlans(targetPlan: any, sourcePlan: any): any {
    if (targetPlan["problems"]) {
      sourcePlan["problems"].forEach(p => {
        let found = false;
        for (var i = 0; i < targetPlan.problems.length; i++) {
          // is a problem from the newly-added content already in the plan?
          if (targetPlan.problems[i].text === p["text"]) {
            found = true;
            // these lines will cause problem to which we've added to be expanded
            p["icon"] = "arrow-dropdown";
            p["expanded"] = true;
            // add all the goals and interventions to the existing problem
            // console.log("goals");
            this.addUndupItems(p["goals"], "text", targetPlan.problems[i].goals);
            // console.log("interventions");
            this.addUndupItems(p["interventions"], "text", targetPlan.problems[i].interventions);
            break;  // no need to look further
          }
        }
        if (!found) {  // never found it, add the whole problem
          // console.log('not found, whole problem');
          p["icon"] = "arrow-dropdown";
          p["expanded"] = true;
          var t = this.deepCopy(p);
          // console.log(t);
          targetPlan.problems.push(t);
        }
      })
    } else {  // no problems in the target, add 'em
      sourcePlan["problems"].forEach(p => {
        p["icon"] = "arrow-dropdown";
        p["expanded"] = true;
      });
      targetPlan["problems"] = this.deepCopy(sourcePlan["problems"]);
      // console.log('after merge', targetPlan["problems"]);
    }
  }

  addUndupItems(source: Array<object>, element: string, target: Array<object>) {
    // console.log('addUndupItems');
    // only insert items not already found
    var work = source;
    var found;
    for (var i = 0; i < target.length; i++) {
      found = undefined;
      for (var j = 0; j < work.length; j++) {
        if (work[j][element] == target[i][element]) {
          found = j;
        }
      }
      if (found < work.length) {
        // remove from working array
        work.splice(found, 1);
      }
    };
    // now add the remaining, those not duplicate/removed
    if (work.length > 0) {
      for (var k = 0; k < work.length; k++) {
        target.push(this.deepCopy(work[k]));
      }
    }
  }

  deletePlan(plan) {
    // remove the designated plan from plans
    var index: number = this.plans.indexOf(plan, 0);
    if (index > -1) {
      this.plans.splice(index, 1);
    }
    // console.log(this.plans);
    this.write();
  };

  initPlans(): void {
    // create an empty plans array
    this.plans = [];
  }

  listPlans(): any {
    return this.plans;
  }

  // reading/writing plans section  ===================
  loadPlansLocal() {
    // reset flags
    this.foundLocal = false;
    this.localAttemptComplete = false;
    this.local = {};  // init/re-init first
    this.readFromLocal()
      .then((data: any) => {
        // console.log(data);
        this.local = JSON.parse(data);
        // console.log('size of local plans', this.local["plans"].length);
        this.foundLocal = true;
        this.localAttemptComplete = true;
        if (typeof this.local !== "object") {
          this.local = { plans: [] };
        }
        this.checkRecent();
      })
      .catch((error: any) => {
        console.log('loadPlansLocal error', error);
        this.foundLocal = false;  // didn't get one
        this.localAttemptComplete = true;  // but the reading is done
        this.local = { plans: [] };  // create an empty
        this.checkRecent();
      });
  }

  loadPlansWeb() {
    // reset flags
    this.foundWeb = false;
    this.webAttemptComplete = false;
    // clear first in case re-read w different userid
    this.web = {};
    // check connection
    this.conn.checkConnection();
    if (this.conn.internet) {
      this.readFromWeb()
        .then((data: any) => {
          this.web = JSON.parse(data);
          // console.log('size of web plans', this.web["plans"].length);
          this.foundWeb = true;
          this.webAttemptComplete = true;
          this.checkRecent();
        })
        .catch((error: any) => {
          console.log('loadplansweb', error);
          this.foundWeb = false;  // didn't get one
          this.webAttemptComplete = true;  // but the getting is done
          this.checkRecent();
        });
    } else {
      console.log('no internet for loadPlansWeb');
      this.foundWeb = false;  // didn't get one
      this.webAttemptComplete = true;  // but the getting is done
      this.checkRecent();
    }
  }

  checkRecent() {
    // this pretty hacky
    // expect this to be called (at least) twice, 
    // once after local read and once after web read
    // can't check currency until both read attempts are completed,
    // but web read might not be completed at all (if subscrptn expired, eg)
    // so set local, then override with web if web is newer

    if (this.localAttemptComplete && this.webAttemptComplete) {
      // choose which to use
      if (this.foundLocal && this.foundWeb) {
        // got both, 
        // compare dates
        if (this.local["lastWrite"] < this.web["lastWrite"]) {
          // web newer
          console.log('web newer');
          this.plans = this.web["plans"];
        } else {
          // local newer
          console.log('local newer');
          this.plans = this.local["plans"];
        }
      }
      if (this.foundLocal && !this.foundWeb) {
        // only got a local, but no web
        // use local
        console.log('local only, no web')
        this.plans = this.local["plans"];
      }
      if (!this.foundLocal && this.foundWeb) {
        // only got a web, but no local
        // use web
        console.log('web only, no local')
        this.plans = this.web["plans"];
      }
      if (!this.foundLocal && !this.foundWeb) {
        // got neither, init to empty
        this.initPlans();
      }
      // notify loading completed
      this.events.publish('loadComplete', Date.now());
    }
  }

  pullWeb() {
    // console.log("pullWeb");
    this.conn.checkConnection();
    if (this.conn.internet) {
      this.readFromWeb()
        .then((data: any) => {
          // ensure we got other than empty plans[]
          // console.log(data);
          this.webAttemptComplete = true;
          this.web = JSON.parse(data);
          if (this.web["plans"]) {
            if (this.web["plans"].length > 0) {
              this.foundWeb = true;
              this.plans = this.web["plans"];
              this.saveToLocal();
            } else {
              console.log('readFromWeb empty result');
            }
          } else {
            console.log('readFromWeb empty result');
            // don't disturb the current plans[] content if read unsuccessful
          }
        })
        .catch((error: any) => {
          console.log('loadplansweb', error);
          // don't disturb the current plans[] content if read unsuccessful
        });
    }
  }

  pushWeb() {
    // console.log("pushWeb");
    if (this.auth.userLoggedIn) {
      // console.log('write logged in=', this.auth.userLoggedIn);
      this.saveToWeb();  // always also save to web, if connected
    }
  }

  write() {
    console.log('writing');
    // console.log('user', this.auth.userId);
    // console.log('logged in', this.auth.userLoggedIn);
    // if (this.pltfrm.is('mobile')) {
    this.saveToLocal();
    // }
    // console.log('write logged in=', this.auth.userLoggedIn);
    if (this.auth.userLoggedIn) {
      console.log('write logged in=', this.auth.userLoggedIn);
      this.saveToWeb();  // always also save to web, if connected
    }
  }

  saveToLocal(): void {
    // console.log("saveToLocal");
    let p = this.packagePlans();
    p = this.encrypt(p, LOCAL_ENCRYPT_KEY);
    const userStorageKey = STORAGE_KEY + '_' + this.auth.userId
    this.LSP.set(userStorageKey, p)
      .then(result => console.log("saved local"))
      .catch(e => console.log("error: " + e));
  }

  readFromLocal(): Promise<object> {
    return new Promise(resolve => {
      const userStorageKey = STORAGE_KEY + '_' + this.auth.userId
      this.LSP.get(userStorageKey)
        .then((data) => {
          // console.log('read local with', userStorageKey);
          // console.log(data);
          if (data) {
            resolve(this.decrypt(data, LOCAL_ENCRYPT_KEY))
          } else {
            console.log('read nothing local, resolving empty plans');
            resolve({ plans: [] });
          }
        });
      // .catch(e => reject => console.log("error: " + e));
    })
  }

  saveToWeb() {
    // console.log("saveToWeb");
    this.conn.checkConnection();
    if (this.conn.internet) {
      let e = this.packagePlans();
      e = this.encrypt(e, this.auth.userKey);
      const p: {} = { plans: e };
      var api: string = this.cpapi.apiURL + "data/" + this.auth.userId;
      this.http.post(api, p)
        .subscribe(data => { console.log("saved to web"); },
          error => {
            // alert("not saved to web");  // remove for production
            //  if no web connection?
            console.log(error);
          });
    } else {
      console.log('not saved to web, no internet');
    }
  }

  readFromWeb(): Promise<object> {
    return new Promise(resolve => {
      var api: string = this.cpapi.apiURL + "data/" + this.auth.userId;
      this.http.get(api)
        .subscribe((data) => {
          // console.log('read from web with', this.auth.userId);
          if (data) {
            let d = this.decrypt(data["plans"] as string, this.auth.userKey);
            // console.log('plans after read from web', d);
            resolve(d);
          } else {
            let d = { plans: [] };
            // console.log('plans after read from web', d);
            resolve(d);
          }
        });
    });
  }

  packagePlans(): string {
    let p: string;
    p = '{ "lastWrite": ' + Date.now().valueOf() + ',';
    p += ' "plans": '
    p += JSON.stringify(this.plans);
    p += '}';
    return p;
  }

  encrypt(data: {}, key: string): string {
    // console.log("encrypting");
    // console.log('key', key);
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decrypt(data: string, key: string): {} {
    // console.log('decrypting');
    // console.log('key', key);
    let bytes = CryptoJS.AES.decrypt(data, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  checkPlanName(name: string): boolean {
    // see if the name's already in use
    var canUseName: boolean = true;
    this.plans.forEach(p => {
      if (p["name"].trim() == name) {
        canUseName = false;
      }
    });
    return canUseName;
  }

  // helper
  deepCopy(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}

// pre-defined outline/starter plan
const GUIDED_PLAN = {
  name: "",
  text: "Guided Starter Plan",
  created: "",
  updated: "",
  problems: [
    {
      text: "General Observation/Assessment",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Teaching, Training & Coaching",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Comfort Care/Symptom Control",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Safety & Mobility",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Emotional/Spiritual",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Skin Care",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Hydration/Nutrition/Elimination",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Therapeutic/Medication",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Care Coordination/Discharge",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    },
    {
      text: "Other Considerations",
      hint: "",
      goals: [],
      interventions: [],
      expanded: true,
      icon: "arrow-dropdown"
    }
  ]
}
