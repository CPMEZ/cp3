import { AuthenticationProvider } from '../authentication/authentication';
import { CPAPI } from '../cpapi/cpapi';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';
import { Platform } from 'ionic-angular';

import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'plans';
const ENCRYPT_KEY = 'A little life with dried tubers'  // ts eliot the waste land, line 7

@Injectable()
export class PersonalPlansProvider {
  lastWrite: string;
  plans: {}[] = [];
  secret: string;
  storeKey: string = ENCRYPT_KEY;

  constructor(private http: HttpClient,
    private LSP: LocalStoreProvider,
    private auth: AuthenticationProvider,
    private cpapi: CPAPI,
    private pltfrm: Platform) {
    console.log('Constructor PersonalPlansProvider Provider');
    this.secret = auth.userKey;
    this.loadPlans();
  }

  local: {};
  readLocal: boolean = false;
  localReadComplete: boolean = false;
  web: {};
  readWeb: boolean = false;
  webReadComplete: boolean = false;

  // .userValidSubscription and .userLoggedIn determines if user can search from master

  // having a user name determines we can read data from web

  loadPlans() {
    console.log('check logged in--should be after authenticate Then');
    this.loadPlansLocal();
    if (this.auth.userLoggedIn) {  
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
        this.checkRecent();
      })
      .catch((error: any) => {
        this.readLocal = false;  // didn't get one
        this.localReadComplete = true;  // but the reading is done
      });
  }
  
  loadPlansWeb() {
    if (this.pltfrm.is('mobile')) {
      this.readFromLocal()
        .then((data: any) => {
          console.log(data);
          this.local = JSON.parse(data);
          this.readLocal = true;
          this.localReadComplete = true;
          this.checkRecent();
        })
        .catch((error: any) => {
          this.readLocal = false;  // didn't get one
          this.localReadComplete = true;  // but the reading is done
          this.checkRecent();
        });
    }
    this.readFromWeb()
      .then((data: any) => {
        console.log(data);
        this.web = JSON.parse(data);
        this.readWeb = true;
        this.webReadComplete = true;
        this.checkRecent();
      })
      .catch((error: any) => {
        this.readWeb = false;  // didn't get one
        this.webReadComplete = true;  // but the getting is done
        this.checkRecent();
      });
  }
  
  checkRecent() {
    // this pretty hacky
    // expect this to be called twice, 
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
        if (this.local["lastWrite"] < this.web["lastWrite"]) {
          // web newer
          this.plans = this.web["plans"];
        }
      }
    //    else if (this.readLocal) {
    //     // local only, use
    //     this.plans = this.local["plans"];
    //   } else if (this.readWeb) {
    //     // web only, use
    //     this.plans = this.web["plans"];
    //   } else {
    //     // none, init
    //     this.initPlans()
    //   }

    } // no "else" might be a problem
  }

  write() {
    // console.log(this.pltfrm);
    // console.log(this.plans);
    if (this.pltfrm.is('mobile')) {
      this.saveToLocal();
    }
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
          resolve(this.decrypt(data, this.secret))
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
          resolve(this.decrypt(data["plans"] as string, this.secret));
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

  // changeSecret(newsecret) {
  //   this.secret = newsecret;
  //   return this.LSP.ready()
  //     .then(() => {
  //       return this.LSP.set(this.storekey,
  //         this.encrypt(this.localData ? this.localData : '', this.secret));
  //     })
  // }

  encrypt(data: {}, key: string): string {
    console.log("encrypting");
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decrypt(data: string, key: string): {} {
    console.log('decrypting');
    let bytes = CryptoJS.AES.decrypt(data, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

}