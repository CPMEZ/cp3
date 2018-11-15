import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';
import { CPAPI } from '../cpapi/cpapi';
import { HttpClient } from '@angular/common/http';

import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'cp_session' // note CacheProvider does not clear this key on clearCache
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
        private http: HttpClient,
        private LSP: LocalStoreProvider) {
        console.log('Constructor AuthenticationProvider Provider');
        this.encryptKey = ENCRYPT_KEY;
    }

    alreadyLoggedIn(): any {
        // check already logged in
        this.readAuthState().then((r) => {
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
        // TODO: may need to rework this to use store validateReceipt
        // exit if no renewal value
        console.log('checkSubscription');
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
        console.log('readAuthState');
        return new Promise(resolve => {
            this.LSP.get(STORAGE_KEY)
                .then((data) => {
                    if (data) {
                        const state = this.decrypt(data, this.encryptKey);
                        console.log('got state', state);
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
                        this.userId = "";
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

    createSubscription(): Promise<boolean> {
        return new Promise((resolve, reject) => {
        // set up a new user on cpapi
        // console.log("createSubscription");
        // TODO: encrypt user data 
        // let e = this.encrypt(userData, this.cpapi.MASTER_KEY);
        var renewalDate = new Date(Date.now());
        // TODO: actual days needs to be annual or trial period
        // however we'll later change to store validateReceipt to determine && see below also
        // this is setting a MONTHLY subscription
        renewalDate.setDate(renewalDate.getDate());
        //                                +1 because monthly subscription, +1 because .getMonth jan=0
        var ds = renewalDate.getDate() + "/" + (renewalDate.getMonth() + 1 + 1) + "/" + renewalDate.getFullYear();
        let userData = {
            user: this.userId,
            password: this.pwd,
            key: this.encryptKey,
            renewal: ds,
            // TODO also fix when changing to validateReceipt
            renewalType: "auto",  // checks for auto & skips expiration messages
            clientKey: "keyval"
        };
        var api: string = this.cpapi.apiURL + "user/" + this.userId;
        this.http.post(api, userData)
            .subscribe(data => { 
                console.log("saved new user"); 
                resolve(true);
            },
            error => {
                alert("not saved to web");  // remove for production
                //  if no web connection?
                console.log(error);
                reject(false);
            });
        });
    }

    checkUser(user: string): Promise<boolean> {
        return new Promise((resolve) => {
        // see if user already used, or is available, on cpapi
        // console.log("auth checkUser");
        // TODO: could be user is present but expired, allow to be used?  no
        var api: string = this.cpapi.apiURL + "user/" + user;
        this.http.head(api)
            .subscribe(data => { 
                console.log('check user', data);
                console.log("can't use ", user);
                resolve(false);
            },
            error => {
                //  if no web connection?
                console.log('check user error', error);
                console.log("can use ", user);
                resolve(true);
            });
        });
    }
}
