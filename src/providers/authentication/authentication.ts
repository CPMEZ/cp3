import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';
import { CPAPI } from '../cpapi/cpapi';

import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'cp_session'
const ENCRYPT_KEY = 'A little life with dried tubers'  // ts eliot the waste land, line 7

@Injectable()
export class AuthenticationProvider {
   
    userLoggedIn: boolean = false;
    userId: string = "";
    pwd: string = "";
    userKey: string = "";
    renewal: string = "";
    renewalType: string = "";
    clientKey: string = "";  // for payments--TODO, might drop this
    
    userValidSubscription: boolean = false;
    
    WARN_DAYS: number = 5;
    
    encryptKey: string;
    
    constructor(private cpapi: CPAPI, 
        private LSP: LocalStoreProvider) {
        console.log('Constructor AuthenticationProvider Provider');
        this.encryptKey = ENCRYPT_KEY;
    }

    alreadyLoggedIn(): any {
        // check already logged in
        this.readAuthState().then( (r) => {
            return r as boolean;
        });
    }

    authenticate(): Promise<boolean> {
        console.log('authenticate', this.userId, this.pwd);
        return new Promise<boolean>((resolve, reject) => {
            if ((!this.userId) || (!this.pwd)) {
                // exit if either missing
                this.userLoggedIn = false;
                resolve(this.userLoggedIn);
            }
            // TODO encrypt pwd before send
            var path = this.cpapi.apiURL + "user/" + this.userId + "?p=" + this.pwd;
            this.cpapi.getData(path).then((data) => {
                const d = JSON.parse(data);
                // console.log('authenticate.then');
                // console.log(d);
                if (d) {
                    this.userKey = d.key;
                    this.renewal = d.renewal;
                    this.renewalType = d.renewalType;
                    if (this.checkSubscription()) {
                        this.userLoggedIn = true;
                        this.saveAuthState();
                        resolve(this.userLoggedIn);
                    } else { // subscription expired
                        this.userLoggedIn = false;
                        this.saveAuthState();
                        reject(this.userLoggedIn);
                    }
                } else {  // no data, bad credentials
                    this.userLoggedIn = false;
                    this.saveAuthState();
                    reject(this.userLoggedIn);
                }
            });
        });
    }

    checkSubscription(): boolean {
        // exit if no renewal value
        if (!this.renewal) return false;
        // use credentials to check last renewal date
        // let userValidSubscription: boolean = false;
        let expiredMessage: string;
        if (this.renewalType === "auto") {
            return true;
        } else {
            const n = Date.now();
            const d = new Date(this.renewal);
            const millis = d.valueOf() - n.valueOf();
            const duration: number = Math.trunc(millis / (60 * 60 * 24 * 1000));
            if (duration < 0) {  // already expired
                expiredMessage = "Your subscription to Marrelli's Red Book Care Plans has expired.  Please renew to continue building Red Book-based Care Plans.  If you've already renewed, first make sure you're connected to the internet and then login to the app, and your records will be updated.";
                alert(expiredMessage);
                this.userValidSubscription = false;
            } else if (duration < this.WARN_DAYS) {
                expiredMessage = "Your subscription to Marrelli's Red Book Care Plans expires in " + (duration + 1).toString() + " days.  Please renew to continue building Red Book-based Care Plans.";
                alert(expiredMessage);
                this.userValidSubscription = true;
            } else {
                // not expired
                this.userValidSubscription = true;
            }
            return this.userValidSubscription;
        }
    }    
    
    logout() {
        this.userLoggedIn = false;
        // this.userId= "";
        // this.pwd = "";
        this.userKey = "";
        this.renewal = "";
        this.renewalType = "";
        this.clientKey = "";  // for payments--TODO, might drop this
        this.userValidSubscription = false;
        this.saveAuthState();
    }

    readAuthState(): Promise<boolean> {
        return new Promise(resolve => {
            this.LSP.get(STORAGE_KEY)
            .then((data) => {
                console.log('read session');
                if (data) {
                    const state = this.decrypt(data, this.encryptKey);
                    console.log('state', state);
                    this.userLoggedIn = state["userLoggedIn"];
                    this.userId = state["userId"];
                    this.pwd = state["pwd"];
                    this.userKey = state["userKey"];
                    this.renewal = state["renewal"];
                    this.renewalType = state["renewalType"];
                    this.clientKey = state["clientKey"];  // for payments--TODO, might drop this
                    // this.userValidSubscription = this.checkSubscription();
                } else { 
                    this.userLoggedIn = false;
                    this.userId= "";
                    this.pwd = "";
                    this.userKey = "";
                    this.renewal = "";
                    this.renewalType = "";
                    this.clientKey = "";  // for payments--TODO, might drop this
                    this.userValidSubscription = false;                    
                }
                resolve(this.userLoggedIn);
            });
            // .catch(e => reject => console.log("error: " + e));
        })
    }

    saveAuthState() {
        // write user auth parms to local storage
        let state = {};
        state["userId"] = this.userId;
        state["pwd"] = this.pwd;
        state["userKey"] = this.userKey;
        state["renewal"] = this.renewal;
        state["renewalType"] = this.renewalType;
        state["clientKey"] = this.clientKey;
        state["userValidSubscription"] = this.userValidSubscription;
        state["userLoggedIn"] = this.userLoggedIn;
        const s = this.encrypt(state, this.encryptKey);
        // write
        this.LSP.set(STORAGE_KEY, s)
            .then(result => console.log("saved session"))
            .catch(e => console.log("error: " + e));
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
}