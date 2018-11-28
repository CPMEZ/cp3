import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import CryptoJS from 'crypto-js';

import { CPAPI } from '../cpapi/cpapi';
import { AuthenticationProvider } from '../authentication/authentication';
import { LocalStoreProvider } from '../local-store/local-store';
import { MasterPlansProvider } from '../master-plans/master-plans';

const STORAGE_KEY = 'plans';  // note CacheProvider ignores this key on clearCache

@Injectable()
export class PersonalPlansProvider {
  lastWrite: string;
  plans: {}[] = [];
  listSelection: any;  // used by merge, add-plan pages

  constructor(private http: HttpClient,
    public events: Events,
    private LSP: LocalStoreProvider,
    public auth: AuthenticationProvider,
    private cpapi: CPAPI,
    // private pltfrm: Platform,
    public MPP: MasterPlansProvider) {
    console.log('Constructor PersonalPlansProvider Provider');
  }

  local: {};
  readLocal: boolean = false;
  localReadComplete: boolean = false;
  web: {};
  readWeb: boolean = false;
  webReadComplete: boolean = false;
  loadingNow: boolean = false;

  // .userValidSubscription and .userLoggedIn determines if user can search from master

  loadPlans() {
    // clear out plans before reading,
    //    in case new user has signed in
    this.initPlans();
    // reset flags
    this.readLocal = false;
    this.localReadComplete = false;
    this.readWeb = false;
    this.webReadComplete = false;
    
    // always get the local copy regardless of internet
    this.loadPlansLocal();
    if (this.auth.userLoggedIn) {
      // if we can, also get the web copy
      this.loadPlansWeb();
      this.checkRecent();  // use the most recent if we've read both web & local
    }
  }

  // add empty plan
  addPlan(np) {
    // initialize the plan structure for a new one
    let newPlan: any;
    newPlan = { name: np.name, text: np.text, created: "", updated: "", problems: [] };
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    // if (!this.plans) { this.initPlans(); }
    this.plans.push(newPlan);
    // console.log(this.plans);
    this.write();
  }

  // add standard plan section
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
        this.addProblemsFromCondition(newPlan, cond);
        this.plans.push(newPlan);
        // console.log(this.plans);
        this.write();
      });
  }

  addProblemsFromCondition(target, cond) {
    cond["condition"]["problems"].forEach(p => {
      p["icon"] = "arrow-dropdown";
      p["expanded"] = true;
      target["problems"].push(p);
    });
  }
  // END add standard plan section

  // copy your own plan section
    copyPlan(op, np) {
    // create a new plan, 
    // copy all the components from the old one,
    // (have to copy contents individual, so not by reference)
    // add to (personal) plans array
    // let newPlan = Object.assign({},  ...op);
    let newPlan = deepCopy(op);
    newPlan.name = np.name;
    newPlan.text = np.text;
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    // console.log(newPlan);
    this.plans.push(newPlan);
    // console.log(this.plans);
    this.write();
  }

  mergePlan(targetPlan, sourcePlan) {
    // copy all the components from selected plan to the new plan,
    // (have to copy contents individual, so not by reference)
    // and exclude any item from the selected already present in the target
    const d: Date = new Date();
    targetPlan.updated = d.toLocaleDateString();
    this.mergeProblemsFromPlan(targetPlan, sourcePlan);
    // console.log(targetPlan);
    this.write();
  }

  mergeProblemsFromPlan(targetPlan, sourcePlan) {
    // console.log('mergeProblemsFromPlan');
    // if (targetPlan.problems.length > 0) {
      // if the plan is not currently empty, 
      // merge into existing problems
      // console.log('source', sourcePlan["problems"]);
      sourcePlan["problems"].forEach(p => {
        let found = false;
        for (var i = 0; i < targetPlan.problems.length; i++) {
          // problem in newly-added condition already in the plan?
          if (targetPlan.problems[i].text === p["text"]) {
            found = true;
            // these lines will cause problem to which we've added to be expanded
            p["icon"] = "arrow-dropdown";
            p["expanded"] = true;
            // add all the goals and interventions to the existing problem
            // console.log("goals");
            this.addNewItems(p["goals"], "text", targetPlan.problems[i].goals);
            // console.log("interventions");
            this.addNewItems(p["interventions"], "text", targetPlan.problems[i].interventions);
            break;  // no need to look further
          }
        }
        if (!found) {  // never found it, add the whole problem
          // console.log('not found, whole problem');
          p["icon"] = "arrow-dropdown";
          p["expanded"] = true;
          var t = deepCopy(p);
          // console.log(t);
          targetPlan.problems.push(t);
        }
      })
    // }
  }
  // END copy your own plan section

  // helper for add standard and copy your own
  addNewItems(source: Array<object>, element: string, arr: Array<object>) {
    // console.log('addNewItems');
    // only insert items not already found
    var work = source;
    var found;
    for (var i = 0; i < arr.length; i++) {
      found = undefined;
      for (var j = 0; j < work.length; j++) {
        if (work[j][element] == arr[i][element]) {
          found = j;
        }
      }
      if (found < work.length) {
        // remove from working array
        work.splice(found, 1);
      }
    };
    // now add the remaining
    if (work.length > 0) {
      for (var k = 0; k < work.length; k++) {
        arr.push(deepCopy(work[k]));
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
    this.readFromLocal()
      .then((data: any) => {
        // console.log(data);
        this.local = JSON.parse(data);
        this.readLocal = true;
        this.localReadComplete = true;
        if (typeof this.local !== "object") {
          this.local = { plans: [] };
        }
        this.checkRecent();
      })
      .catch((error: any) => {
        this.readLocal = false;  // didn't get one
        this.localReadComplete = true;  // but the reading is done
        this.local = { plans: [] };  // create an empty
        this.checkRecent();
      });
  }

  loadPlansWeb() {
    this.readFromWeb()
      .then((data: any) => {
        // console.log(data);
        this.web = JSON.parse(data);
        this.readWeb = true;
        this.webReadComplete = true;
        this.checkRecent();
      })
      .catch((error: any) => {
        console.log('loadplansweb', error);
        this.readWeb = false;  // didn't get one
        this.webReadComplete = true;  // but the getting is done
        this.checkRecent();
      });
  }

  checkRecent() {
    // this pretty hacky
    // expect this to be called (at least) twice, 
    // once after local read and once after web read
    // can't check currency until both read attempts are completed,
    // but web read might not be completed at all (if subscrptn expired, eg)
    // so set local, then override with web if web is newer

    if (this.localReadComplete && this.webReadComplete) {
      // notify loading completed
      this.events.publish('loadComplete', Date.now());
      // find newest
      if (this.readLocal && this.readWeb) {
        // got both, compare dates
        // console.log('comparing');
        if (this.local["lastWrite"] < this.web["lastWrite"]) {
          // web newer
          console.log('web newer');
          this.plans = this.web["plans"];
        }
      } else if (this.readLocal) {
        // only got a local, use it
        console.log('local only, no web')
        this.plans = this.local["plans"];
      } else if (this.readWeb) {
        // only got a web, use it
        console.log('web only, no local')
        this.plans = this.web["plans"];
      } else {
        // none, init
        this.initPlans();
      }
    } // no "else" might be a problem
  }

  write() {
    console.log('writing');
    // if (this.pltfrm.is('mobile')) {
    this.saveToLocal();
    // }
    if (this.auth.userLoggedIn) {
      this.saveToWeb();  // always also save to web, if connected
    }
  }

  saveToLocal(): void {
    // console.log("saveToLocal");
    let p = this.packagePlans();
    p = this.encrypt(p, this.auth.userKey);
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
        console.log('read local with', userStorageKey);
          // console.log(data);
          if (data) {
            resolve(this.decrypt(data, this.auth.userKey))
          } else {
            console.log('read nothing local, resolving empty plans');
            resolve({ plans: [] })
          }
        });
      // .catch(e => reject => console.log("error: " + e));
    })
  }

  saveToWeb() {
    // console.log("saveToWeb");
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
  }

  readFromWeb(): Promise<object> {
    return new Promise(resolve => {
      var api: string = this.cpapi.apiURL + "data/" + this.auth.userId;
      this.http.get(api)
        .subscribe((data) => {
          console.log('read from web');
          if (data) {
            resolve(this.decrypt(data["plans"] as string, this.auth.userKey));
          } else {
            resolve({ plans: [] });
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
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decrypt(data: string, key: string): {} {
    // console.log('decrypting');
    let bytes = CryptoJS.AES.decrypt(data, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  checkPlanName(name: string): boolean {
    // see if the name's already in use
    var canUseName: boolean = true;
    this.plans.forEach(p => {
      if (p["name"] == name) {
        canUseName = false;
      }
    });
    return canUseName;
  }
}

// helper
function deepCopy(obj) {
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
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}
