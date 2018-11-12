import { AuthenticationProvider } from '../authentication/authentication';
import { CPAPI } from '../cpapi/cpapi';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';
// import { Platform } from 'ionic-angular';

import CryptoJS from 'crypto-js';
import { MasterPlansProvider } from '../master-plans/master-plans';

const STORAGE_KEY = 'plans';  // note CacheProvider ignores this key on clearCache

@Injectable()
export class PersonalPlansProvider {
  lastWrite: string;
  plans: {}[] = [];
  secret: string;
  storeKey: string;

  constructor(private http: HttpClient,
    private LSP: LocalStoreProvider,
    public auth: AuthenticationProvider,
    private cpapi: CPAPI,
    // private pltfrm: Platform,
    public MPP: MasterPlansProvider) {
    console.log('Constructor PersonalPlansProvider Provider');
    this.secret = auth.userKey;
    this.storeKey = auth.encryptKey;
  }

  local: {};
  readLocal: boolean = false;
  localReadComplete: boolean = false;
  web: {};
  readWeb: boolean = false;
  webReadComplete: boolean = false;

  // .userValidSubscription and .userLoggedIn determines if user can search from master

  loadPlans() {
    // console.log('check logged in--should be after authenticate Then');
    // always get the local copy
    this.loadPlansLocal();
    if (this.auth.userLoggedIn) {
      // if we can, also get the web copy
      this.loadPlansWeb();
      this.checkRecent();  // use the most recent if we've read both web & local
    }
  }

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
        this.addProblems(newPlan, cond);
        this.plans.push(newPlan);
        console.log(this.plans);
        this.write();
      });
  }

  addProblems(np, cond) {
    cond["condition"]["problems"].forEach(p => {
      p["icon"] = "arrow-dropdown";
      p["expanded"] = true;
      np["problems"].push(p);
    });
  }

  copyPlan(op, np) {
    // create a new plan, 
    // copy all the components from the old one,
    // add to (personal) plans array
    const newPlan = { ...op };
    newPlan.name = np.name;
    newPlan.text = np.text;
    const d: Date = new Date();
    newPlan.created = d.toLocaleDateString();
    newPlan.updated = d.toLocaleDateString();
    this.plans.push(newPlan);
    // console.log(this.plans);
    this.write();
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
        this.checkRecent();
      });
  }

  loadPlansWeb() {
    // can't see why i was doing this here instead of only in loadPlansLocal
    // if (this.pltfrm.is('mobile')) {
    //   this.readFromLocal()
    //     .then((data: any) => {
    //       console.log(data);
    //       this.local = JSON.parse(data);
    //       this.readLocal = true;
    //       this.localReadComplete = true;
    //       this.checkRecent();
    //     })
    //     .catch((error: any) => {
    //       this.readLocal = false;  // didn't get one
    //       this.localReadComplete = true;  // but the reading is done
    //       this.checkRecent();
    //     });
    // }
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
    if (this.localReadComplete) {
      this.plans = this.local["plans"];
    }
    if (this.localReadComplete && this.webReadComplete) {
      if (this.readLocal && this.readWeb) {
        // got both, compare dates
        console.log('comparing');
        if (this.local["lastWrite"] < this.web["lastWrite"]) {
          // web newer
          console.log('web newer');
          this.plans = this.web["plans"];
        }
      } else if (this.readLocal) {
        // only got a local, use it
        this.plans = this.local["plans"];
      } else if (this.readWeb) {
        // only got a web, use it
        this.plans = this.web["plans"];
      } else {
        // none, init
        this.initPlans()
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
    p = this.encrypt(p, this.secret);
    this.LSP.set(STORAGE_KEY, p)
      .then(result => console.log("saved local"))
      .catch(e => console.log("error: " + e));
  }

  readFromLocal(): Promise<object> {
    return new Promise(resolve => {
      this.LSP.get(STORAGE_KEY)
        .then((data) => {
          console.log('read from local');
          // console.log(data);
          if (data) {
            resolve(this.decrypt(data, this.secret))
          } else {
            resolve({ plans: [] })
          }
        });
      // .catch(e => reject => console.log("error: " + e));
    })
  }

  saveToWeb() {
    // console.log("saveToWeb");
    let e = this.packagePlans();
    e = this.encrypt(e, this.secret);
    const p: {} = { plans: e };
    var api: string = this.cpapi.apiURL + "data/" + this.auth.userId;
    this.http.post(api, p)
      .subscribe(data => { console.log("saved to web"); },
        error => {
          alert("not saved to web");  // remove for production
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
            resolve(this.decrypt(data["plans"] as string, this.secret));
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
    console.log("encrypting");
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decrypt(data: string, key: string): {} {
    console.log('decrypting');
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


  // changeSecret(newsecret) {
  //   this.secret = newsecret;
  //   return this.LSP.ready()
  //     .then(() => {
  //       return this.LSP.set(this.storekey,
  //         this.encrypt(this.localData ? this.localData : '', this.secret));
  //     })
  // }
