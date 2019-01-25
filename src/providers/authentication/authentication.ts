import { Injectable } from '@angular/core';
import { LocalStoreProvider } from '../local-store/local-store';
// import { ConnectionProvider } from '../connection/connection';
import { CPAPI } from '../cpapi/cpapi';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import CryptoJS from 'crypto-js';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

const STORAGE_KEY = 'cp_session' // note CacheProvider does not clear this key on clearCache
const STATE_ENCRYPT_KEY = 'A little life with dried tubers'  // ts eliot the waste land, line 7

@Injectable()
export class AuthenticationProvider {

    userLoggedIn: boolean = false;
    userId: string = "";
    pwd: string = "";
    userKey: string = "";
    renewal: string = "";
    renewalType: string = "";
    clientKey: string = "";  // for payments--TODO, might drop this
    subType: string = "";

    userValidSubscription: boolean = false;

    WARN_DAYS: number = 5;

    encryptKey: string;

    constructor(private cpapi: CPAPI,
        private http: HttpClient,
        private iap: InAppPurchase,
        // private conn: ConnectionProvider,
        private LSP: LocalStoreProvider) {
        console.log('Constructor AuthenticationProvider Provider');
    }

    alreadyLoggedIn(): Promise<boolean> {
        // check already logged in
        // console.log('in alreadyLoggedIn');
        return new Promise<boolean>((resolve) => {
            this.readAuthState().then((r) => { resolve(r); })
        });
    }

    async authenticate(): Promise<boolean> {
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
                // console.log('authenticate getData.then');
                // console.log(d);
                if (d) {
                    this.userKey = d.key;
                    this.renewal = d.renewal;
                    this.renewalType = d.renewalType;
                    this.checkSubscription()
                        .then((t) => { this.userLoggedIn = t; })
                        .catch((f) => { this.userLoggedIn = f; });
                } else {  // no data, bad credentials
                    // TODO:  clear other userData contents
                    this.userLoggedIn = false;
                }
                this.saveAuthState();
                if (this.userLoggedIn) { resolve(this.userLoggedIn) } else { reject(this.userLoggedIn) }
            })
                .catch((err) => {
                    // console.log('authenticate getData.catch');
                    this.userLoggedIn = false;
                    this.saveAuthState();
                    reject(this.userLoggedIn);
                });
        });
    }

    checkSubscription(): Promise<boolean> {
        // console.log('checkSubscription');
        // check even if supposed to be auto-renew, as user may have cancelled
        return new Promise<boolean>((resolve, reject) => {

            // exit if no renewal value
            if (!this.userLoggedIn) reject(false);

            let expiredMessage: string;
            // if not logged in, renewal irrelevant and/or this.renewal will be absent
            // if logged in, the this.xxx values should be populated
            const n = Date.now();
            const d = new Date(this.renewal);
            const millis = d.valueOf() - n.valueOf();
            const duration: number = Math.trunc(millis / (60 * 60 * 24 * 1000));
            // check to see if user has re-upped via app store
            if (duration < this.WARN_DAYS) {
                // only check for renewal if within warn_days of expiring, just to reduce traffic/server load
                // verify with apple receipt first
                this.iap.restorePurchases()
                    .then((purchases) => {
                        console.log(purchases);
                        // see if a valid one of mine in the list
                        // [ { productId:, state: (android), transactionId:, date:, 
                        //     productType: (android), receipt: (android), signature: (android) }, ...]
                        for (var rp = 0; rp < purchases.length; rp++) {
                            if (purchases[rp]['productId'] == 'CP3SubAnnual' ||
                                purchases[rp]['productId'] == 'CP3SubMonthly') {
                                // found one
                                console.log(purchases[rp]['productId']);
                                console.log(purchases[rp]['state']);
                                console.log(purchases[rp]['date']);
                                console.log(purchases[rp]['transactionId']);
                                // check date
                                const storeRenewDate = new Date(purchases[rp]['date']);
                                console.log(storeRenewDate);
                                // if renewed, storeRenewDate will be > my authState.renewal "d"
                                if (storeRenewDate.valueOf() > d.valueOf()) {
                                    // renewed
                                    // let the rest of the app know about it
                                    this.userValidSubscription = true;
                                    // update my server date, don't give message
                                    this.renewSubscription(storeRenewDate);
                                    resolve(this.userValidSubscription);
                                } else {
                                    // = or <, not renewed (should only be =, store date should never be less than my date)
                                    // give the message
                                    if (duration < 0) {  // already expired
                                        expiredMessage = "Your subscription to Marrelli's Red Book Care Plans has expired.  Please renew to continue building Red Book-based Care Plans.  If you've already renewed, first make sure you're connected to the internet and then login to the app, and your records will be updated.";
                                        alert(expiredMessage);
                                        this.userValidSubscription = false;
                                        resolve(this.userValidSubscription);
                                    } else if (duration < this.WARN_DAYS) {
                                        expiredMessage = "Your subscription to Marrelli's Red Book Care Plans expires in " + (duration + 1).toString() + " days." +
                                            "  It will automatically renew 24 hrs before expiration, unless you cancel.";
                                        alert(expiredMessage);
                                        this.userValidSubscription = true;
                                        resolve(this.userValidSubscription);
                                    }
                                }
                            }  // else not one of mine, do nothing
                        }
                        // never found one
                    })
            } else {
                // expiration >= today-warn_days
                this.userValidSubscription = true;
                resolve(this.userValidSubscription);
            }
        })
    }

    logout() {
        // save the user id, just for user convenience in re-logging in
        const uid = this.userId;
        this.clearUserData();
        this.userId = uid;
        this.saveAuthState();
    }

    private clearUserData() {
        this.userLoggedIn = false;
        this.userId = "";
        this.pwd = "";
        this.userKey = "";
        this.renewal = "";
        this.renewalType = "";
        this.clientKey = ""; // for payments--TODO, might drop this
        this.subType = "";
        this.userValidSubscription = false;
    }

    readAuthState(): Promise<boolean> {
        return new Promise(resolve => {
            this.LSP.get(STORAGE_KEY)
                .then((data) => {
                    if (data) {
                        const state = this.decrypt(data, STATE_ENCRYPT_KEY);
                        // console.log('got state', state);
                        this.userLoggedIn = state["userLoggedIn"];
                        this.userId = state["userId"];
                        this.pwd = state["pwd"];
                        this.userKey = state["userKey"];
                        this.renewal = state["renewal"];
                        this.renewalType = state["renewalType"];
                        this.clientKey = state["clientKey"];  // for payments--TODO, might drop this
                        this.subType = state["subType"];
                        // this.userValidSubscription = this.checkSubscription();
                    } else {
                        this.clearUserData();
                    }
                    resolve(this.userLoggedIn);
                });
            // .catch(e => reject => console.log("error: " + e));
        })
    }

    saveAuthState() {
        // write user auth parms to local storage
        let state = this.getUserDataObject({});
        // state["userId"] = this.userId;
        // state["pwd"] = this.pwd;
        // state["userKey"] = this.userKey;
        // state["renewal"] = this.renewal;
        // state["renewalType"] = this.renewalType;
        // state["clientKey"] = this.clientKey;
        // state["subType"] = this.subType;
        // state["userValidSubscription"] = this.userValidSubscription;
        // state["userLoggedIn"] = this.userLoggedIn;
        const s = this.encrypt(state, STATE_ENCRYPT_KEY);
        // write
        this.LSP.set(STORAGE_KEY, s)
            .then(result => console.log("saved session"))
            .catch(e => console.log("error: " + e));
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

    createSubscription(productId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // set up a new user on cpapi
            // console.log("createSubscription");
            // TODO: encrypt user data 
            var renewalDate = new Date(Date.now());
            // TODO we'll later change to store validateReceipt to determine && see below also
            renewalDate.setDate(renewalDate.getDate());
            var ds;
            var month = renewalDate.getMonth() + 1;  // getMonth is 0-based, make 1-based
            var year = renewalDate.getFullYear();
            switch (productId) { // match values in subselect.ts.initStore()
                case 'CP3SubMonthly':
                    // expires next month
                    month += 1;
                    if (month === 13) {
                        // end of year, make jan next year
                        month = 1;
                        year += 1;
                    }
                    break;
                case 'CP3SubAnnual':
                    // expires same date next year
                    year += 1;
                    break;
                default:
                    break;
            }
            ds = month.toString() + "/" +
                renewalDate.getDate().toString() + "/" +
                year.toString();
            const userData = this.getUserDataObject({ renewal: ds });
            // remove the flags?  userLoggedIn and userValidSubscription
            var api: string = this.cpapi.apiURL + "user/" + this.userId;
            let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
            let postOptions = { headers: httpHeaders }
            console.log('before new user post', userData);
            this.http.post(api, userData, postOptions)
                .subscribe(data => {
                    console.log("saved user");
                    console.log('returned from new user post', data);
                    resolve(true);
                },
                    error => {
                        console.log('new user post error', error);
                        alert("There was a problem saving or restoring your user information.");
                        console.log(error);
                        reject(false);
                    });
        });
    }

    renewSubscription(renewalDate: Date): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // update user on cpapi with renewed subscription date
            console.log("renewSubscription");
            // TODO: encrypt user data 
            var ds = (renewalDate.getMonth() + 1).toString() + "/" +
                renewalDate.getDate().toString() + "/" +
                renewalDate.getFullYear().toString();
            // TODO:  maybe: read the userData from the server and update only the renewal date
            // TODO:  could i get here if these this.xxx values blank?
            const userData = this.getUserDataObject({ renewal: ds });
            // TODO: same question:  should i remove the flages userLoggedIn and userValidSubscription before writing?
            var api: string = this.cpapi.apiURL + "user/" + this.userId;
            // this.conn.checkConnection();
            let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
            let postOptions = { headers: httpHeaders }
            console.log('before renew post', userData);
            this.http.post(api, userData, postOptions)
                .subscribe(data => {
                    console.log("renewed user");
                    console.log('returned by renew post', data);
                    this.saveAuthState();
                    resolve(true);
                },
                    error => {
                        console.log('renewal post error', error);
                        alert("There was a problem updating your user information.");
                        console.log(error);
                        reject(false);
                    });
        });
    }

    private getUserDataObject(parm: object) {
        const base = {
            userLoggedIn: this.userLoggedIn,
            userId: this.userId,
            pwd: this.pwd,
            userKey: this.userKey,
            renewal: this.renewal,
            renewalType: "auto",
            clientKey: "keyval",
            subType: this.subType,
            userValidSubscription: this.userValidSubscription
        };
        return { ...base, ...parm };
    }

    checkUser(user: string): Promise<boolean> {
        return new Promise((resolve) => {
            // see if user already used, or is available, on cpapi
            // TODO: could be user is present but expired, allow to be used?  no
            var api: string = this.cpapi.apiURL + "user/" + user;
            this.http.head(api)
                .subscribe(data => { resolve(false); },
                    error => { resolve(true); });
        });
    }
}
