import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LocalStoreProvider } from '../local-store/local-store';
import { CPAPI } from '../cpapi/cpapi';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import CryptoJS from 'crypto-js';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

const STORAGE_KEY = 'cp_session' // note CacheProvider does not clear this key on clearCache
const STATE_ENCRYPT_KEY = 'A little life with dried tubers'  // ts eliot the waste land, line 7

interface storeDataType {
    subscription: string,
    state: string,
    date: string,
    expDate: string
}

@Injectable()
export class AuthenticationProvider {

    firstTime: boolean = true;

    userLoggedIn: boolean = false;
    user: string = "";
    password: string = "";
    key: string = "";
    renewal: string = "";
    // subLastVerified: string = "";
    subType: string = "";
    subState: string = 'never';  // current, expired, never; used in subselect to enable 'renew'

    WARN_DAYS: number = 5;

    encryptKey: string;

    constructor(private cpapi: CPAPI,
        private http: HttpClient,
        private iap: InAppPurchase,
        private plt: Platform,
        private LSP: LocalStoreProvider) {
        console.log('Constructor AuthenticationProvider Provider');
        // console.log(plt.platforms);
    }

    async authenticate(): Promise<boolean> {
        this.user = this.user.trim();
        console.log('authenticate', this.user, this.password);
        var goodCredentials = await this.getUserData(this.user, this.password);
        if (goodCredentials) {
            var goodSubscription = await this.checkSubscription();
            if (goodSubscription) {
                // alert('good subscription');
                this.userLoggedIn = true;
                return true;
            } else {
                // alert('bad subscription');
                this.userLoggedIn = false;
                return false;
            }
        } else {
            // alert('bad credentials');
            this.userLoggedIn = false;
            return false;
        }
    }

    async getUserData(user: string, pwd: string): Promise<boolean> {
        console.log('getUserData');
        var path = this.cpapi.apiURL + "user/" + user + "?p=" + pwd;
        if ((!user) || (!pwd)) { return false; }
        try {
            let data = await this.cpapi.getData(path);
            if (!!data) {
                const d = JSON.parse(data);
                console.log(d);
                if (d) {
                    // set userData values
                    this.userLoggedIn = true;  // until checkSubscription might override it
                    this.user = d['user'];
                    this.user = this.user.trim();
                    this.key = d['key'];
                    this.renewal = d['renewal'];
                    this.subType = d['subType'];
                    this.saveAuthState();
                    return true;
                } else {  // no data, bad credentials
                    this.clearUserData();
                    this.saveAuthState();
                    return false;
                }
            }
        }
        catch (err) {
            console.log('checkCredentials getData.catch', err);
            alert('UserId or Password not recognized');
            this.clearUserData();
            // reset user, in case they just typo'd the pwd
            this.user = user.trim();
            this.saveAuthState();
            return false;
        };
    }

    async checkSubscription(): Promise<boolean> {
        console.log('checkSubscription');
        // check even if supposed to be auto-renew, as user may have cancelled

        // if not logged in, renewal irrelevant and/or this.renewal will be absent
        // if logged in, the this.xxx values should be populated
        const n = Date.now();
        const d = new Date(this.renewal);  // from local user data
        const millis = d.valueOf() - n.valueOf();
        const duration: number = Math.trunc(millis / (60 * 60 * 24 * 1000));
        // TODO:  ****in production, need to check this more often/earlier to catch cancelled subs
        // only check for renewal on some kind of interval, just to reduce traffic/server load
        // maybe "subLastVerified" in server user data

        // [this should preserve the non-apple test subscriptions]
        if (duration < this.WARN_DAYS) {
            // TODO:  android 
            // check to see if user has re-upped via app store
            // verify with apple first
            // MOCK ****************************************************
            // if (1 === 1) {
            //     let storeData: storeDataType = await this.mockCheckStore2();
            // MOCK ****************************************************
            // if not on ios, no need to check "with apple"
            // console.log(this.plt.platforms());  // all of a sudden this returns ios when on --lab, 
            //                                          therefore does case 1 vs cases 4 or 5, but doesn't matter

            // TODO implement/test for android
            // if (this.plt.is('ios')) {  //<--previous version
            if (this.plt.is('cordova')) {
                let storeData: storeDataType = await this.checkStore();
                this.subState = storeData.state;
                this.subType = storeData.subscription;
                switch (storeData.state) {
                    case 'current':
                        // 2 second test:  test1 has not expired (apple-sandbox-2 within 5 minutes)
                        // alert('2: duration<warn, ios, storestate=current');
                        // reconcile local subscription date if needed
                        this.reconcileSubscription(storeData.expDate);
                        return true;
                    case 'expired':
                        // 3 third test:  test1 has expired (apple-sandbox-2 after 5 minutes)
                        // alert('3: duration<warn, ios, storestate=expired');
                        alert(
                            "Your subscription to Marrelli's Red Book Care Plans has expired.  " +
                            "Please renew to continue building Red Book-based Care Plans.  " +
                            "Choose WORK OFFLINE to continue without renewing.");
                        return false;
                    case 'never':
                        // 1 first test:  test1 has no apple subscription (apple-sandbox-2)
                        // have to set up to be duration < warn days to reach here
                        // eg 2/4, 5/19
                        // alert('1: duration<warn, ios, storestate=never');
                        alert(
                            "Shouldn't have reached this point with good credentials but " +
                            "no valid store subscription.  You must be a beta tester.  :)");
                        return false;
                    default:
                        return false;
                }
            } else {  // not ios, using server data, not store
                if (duration < 0) {
                    // alert('4: duration<0, NOT ios');
                    alert(
                        "Your subscription to Marrelli's Red Book Care Plans has expired.  " +
                        "Please renew to continue building Red Book-based Care Plans.  " +
                        "Choose WORK OFFLINE to continue without renewing.");
                    return false;
                } else { // ie, 0 < duration < warn_days
                    // alert('5: duration<warn, NOT ios');
                    alert(
                        "Your subscription to Marrelli's Red Book Care Plans expires in " + (duration + 1).toString() + " days." +
                        "  It will automatically renew 24 hrs before expiration, unless you cancel.");
                    return true;
                }
            }
        } else {
            // 6 test_ expires > 5 days
            // alert('6: duration >= warn');
            return true;
        }
    }


    async checkStore(): Promise<storeDataType> {
        console.log('checkStore');
        // no purchases at all,
        // purchases but not mine,
        // purchase mine but expired,
        // purchase mine and current

        // initialize to not found
        let storeResult: storeDataType
            = { subscription: 'none', state: 'never', date: '', expDate: '' };
        try {
            let purchases = await this.iap.restorePurchases()
            // [ { productId:, state: (android), transactionId:, date:, 
            //     productType: (android), receipt: (android), signature: (android) }, ...]
            if (purchases.length > 0) {
                // filter for my types only
                // const myTypes = ['CP3SubAnnual', 'CP3SubMonthly'];
                // const myTypes = ['CP3SubMonthly'];
                const myTypes = ['CP3SubMonthly', 'cp3submonthly'];
                let fp = purchases.filter(x => myTypes.indexOf(x['productId']) !== -1);
                // add expiration date -- using this to compare equalizes monthly and annual purchases
                fp.forEach(x => x['expDate'] = this.getExpiration(x['date'], x['productId']));
                // reduce to latest expiring-purchase only
                const latestExpPurchase = fp.reduce((a, b) => (a['expDate'] > b['expDate']) ? a : b);
                if ((latestExpPurchase['expDate'] > Date.now()) 
                    && ((this.plt.is('ios')) 
                        || (this.plt.is('android') && latestExpPurchase['state'] == 0))) {
                    // good subscription
                    console.log('good subscription');
                    storeResult = {
                        subscription: latestExpPurchase['productId'],
                        state: 'current',
                        date: latestExpPurchase['date'],
                        expDate: latestExpPurchase['expDate']  // this is making an implicit conversion to ISOString
                    };
                } else {
                    // expired subscription  // expired or canceled if android
                    console.log('expired subscription');
                    storeResult = {
                        subscription: latestExpPurchase['productId'],
                        state: 'expired',
                        date: latestExpPurchase['date'],
                        expDate: latestExpPurchase['expDate']  // this is making an implicit conversion to ISOString
                    };
                }
            } else {  // no purchases retrieved
                // returns default storeResult:  state: 'never'
            }
        }
        catch (err) {
            console.log('restorePurchase error', err);
        }
        // error, or
        // never found in purchases, or
        // nothing in purchases,
        //  storeResult will be as initialized
        return storeResult;
    }

    getExpiration(start: string, subType: string): Date {
        var exp: Date, d: Date;
        // days-in-month ignores leap years, let store worry about it
        const dIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        const day = 24 * 60 * 60 * 1000;
        const year = 365 * day;
        d = new Date(start);
        switch (subType) {
            case 'CP3SubAnnual':
                exp = new Date(d.valueOf() + year);
                break;
            case 'CP3SubMonthly':
                exp = new Date(d.valueOf() + (dIM[d.getMonth()] * day));
                break;
            case 'cp3submonthly':
                exp = new Date(d.valueOf() + (dIM[d.getMonth()] * day));
                break;
            default:  // assume monthly
                exp = new Date(d.valueOf() + (dIM[d.getMonth()] * day));
                break;
        }
        return exp;
    }

    logout() {
        // reset firstTime, for use in welcome (??)
        this.firstTime = true;
        // save the user id, just for user convenience in re-logging in
        const uid = this.user;
        this.clearUserData();
        this.user = uid.trim();
        this.saveAuthState();
    }

    private clearUserData() {
        console.log('clearUserData');
        this.userLoggedIn = false;

        this.user = "";
        this.password = "";
        this.key = "";
        this.renewal = "";
        this.subType = "";
        this.subState = "";  // TODO:  this might cause a problem, i added after testing code for subState
    }

    readAuthState(): Promise<boolean> {
        return new Promise(resolve => {
            this.LSP.get(STORAGE_KEY)
                .then((data) => {
                    if (data) {
                        const state = this.decrypt(data, STATE_ENCRYPT_KEY);
                        console.log('got state', state);
                        this.userLoggedIn = state['userLoggedIn'];
                        this.user = state['user'];
                        this.user = this.user.trim();
                        this.password = state['password'];
                        this.key = state['key'];
                        this.renewal = state['renewal'];
                        this.subType = state['subType'];
                    } else {
                        this.clearUserData();
                    }
                    resolve(this.userLoggedIn);
                });
            // .catch(e => reject => console.log("error: " + e));
        })
    }

    saveAuthState() {
        // write user auth parms to LOCAL storage
        const state = {
            userLoggedIn: this.userLoggedIn,
            user: this.user.trim(),
            password: this.password,
            key: this.key,
            renewal: this.renewal,
            subType: this.subType
        }
        console.log(state.user);
        const s = this.encrypt(state, STATE_ENCRYPT_KEY);
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
        // alert('createSubscription ' + productId);
        return new Promise((resolve, reject) => {
            // set up a new user on cpapi
            // console.log("createSubscription");
            // TODO: encrypt user data
            var baseDate = new Date(Date.now());
            const strNow = (baseDate.getMonth() + 1) + '/' + baseDate.getDate() + '/' + baseDate.getFullYear();
            var renewalDate = this.getExpiration(strNow, productId);
            // TODO we'll later change to store validateReceipt to determine && see below also
            const userData = {
                user: this.user.trim(),
                password: this.password,
                key: this.key,
                // renewal: ds,
                renewal: renewalDate.toISOString(),
                subType: productId
            };
            // remove the userLoggedIn flag? 
            var api: string = this.cpapi.apiURL + "user/" + this.user.trim();
            let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
            let postOptions = { headers: httpHeaders }
            console.log('before new user post', userData);
            this.http.post(api, userData, postOptions)
                .subscribe(data => {
                    // alert('returned from post ' + data);
                    resolve(true);
                },
                    error => {
                        alert("There was a problem saving or restoring your user information.");
                        console.log(error);
                        reject(false);
                    });
        });
    }

    reconcileSubscription(expDate: string): Promise<boolean> {
        // TODO:  maybe: read the userData from the server and update only the renewal date
        return new Promise((resolve, reject) => {
            console.log("renewSubscription");
            // TODO: encrypt user data
            const n = new Date(expDate);  // from store
            const d = new Date(this.renewal);  // from local user data
            // check subscription date <> this.renewal, ie
            //      apple has different date than i have, means
            //      user renewed w apple, or user got refunded by apple
            if (n.valueOf() !== d.valueOf()) {
                // update user on cpapi with renewed subscription date
                const userData = {
                    user: this.user.trim(),
                    password: this.password,
                    key: this.key,
                    renewal: expDate,
                    subType: this.subType
                };
                var api: string = this.cpapi.apiURL + "user/" + this.user.trim();
                // this.conn.checkConnection();
                let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
                let postOptions = { headers: httpHeaders }
                console.log('before renew post', userData);
                this.http.post(api, userData, postOptions)
                    .subscribe(data => {
                        this.saveAuthState();
                        resolve(true);
                    },
                        error => {
                            alert("There was a problem updating your user information.");
                            console.log(error);
                            reject(false);
                        });
            } else {  // update not needed, dates agree
                resolve(true);
            }
        });
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

    // helper
    reportState(msg: string): void {
        if (this.plt.is('cordova')) {
            const st = msg + '-->' +
                'userLoggedIn=' + this.userLoggedIn + ' ' +
                'user=' + this.user + ' ' +
                'password=' + this.password + ' ' +
                'key=' + this.key + ' ' +
                'renewal=' + this.renewal + ' ' +
                'subType=' + this.subType + ' ' +
                'subState=' + this.subState;
            alert(st);
        } else {
            console.log(msg + '-->');
            console.log('userLoggedIn=', this.userLoggedIn);  // until checkSubscription might override it
            console.log('user=', this.user);
            console.log('password=', this.password);
            console.log('key=', this.key);
            console.log('renewal=', this.renewal);
            console.log('subType=', this.subType);
            console.log('subState=', this.subState);
            console.log('<--' + msg);
        }
    }
}

// MOCKS

// async mockCheckStore(): Promise < storeDataType > {
//     return {
//         subscription: '',
//         state: 'never',
//         date: '',
//         expDate: ''
//         // subscription: 'CP3SubMonthly',
//         // state: 'expired',
//         // date: '2/2/2019'
//     } as storeDataType;
// }

// async mockCheckStore2(): Promise < storeDataType > {
//     console.log('mockcheckStore2');
//     let storeResult: storeDataType
//         = { subscription: 'none', state: 'never', date: '', expDate: '' };
//     try {
//         // let purchases = await this.iap.restorePurchases()
//         const purchases =
//             [
//                 { productId: "CP3SubMonthly", state: 3, transactionId: 'abc123', date: "2017-02-02T06:00:00.000Z" },
//                 { productId: "CP3SubMonthly", state: 3, transactionId: 'abc123', date: "2017-02-04T06:00:00.000Z" },
//                 { productId: "CP3SubAnnual", state: 3, transactionId: 'abc123', date: "2016-03-19T06:00:00.000Z" },
//                 { productId: "CP3SubMonthly", state: 3, transactionId: 'abc123', date: "2017-01-14T06:00:00.000Z" },
//                 { productId: "CP3SubMonthly", state: 3, transactionId: 'abc123', date: "2017-02-01T06:00:00.000Z" },
//                 { productId: "CP3SubMonthly", state: 3, transactionId: 'abc123', date: "2016-12-19T06:00:00.000Z" },
//             ]
//             if(purchases.length > 0) {
//     // filter for my types only
//     const myTypes = ['CP3SubAnnual', 'CP3SubMonthly'];
//     let fp = purchases.filter(x => myTypes.indexOf(x['productId']) !== -1);
//     console.log(fp);
//     // add expiration date -- using this to compare equalizes monthly and annual purchases
//     fp.forEach(x => {
//         console.log('fd[] date', x['date']);
//         x['expDate'] = this.getExpiration(x['date'], x['productId']);
//         console.log('fd[] expDate', x['expDate'].toISOString());
//     });
//     console.log(fp);
//     // reduce to latest expiring-purchase only
//     const latestExpPurchase = fp.reduce((a, b) => (a['expDate'] > b['expDate']) ? a : b);
//     console.log(latestExpPurchase);
//     if (latestExpPurchase['expDate'] > Date.now()) {
//         // good subscription
//         console.log('good subscription');
//         storeResult = {
//             subscription: latestExpPurchase['productId'],
//             state: 'current',
//             date: latestExpPurchase['date'],
//             expDate: latestExpPurchase['expDate']
//         };
//     } else {
//         // expired subscription
//         console.log('expired subscription');
//         storeResult = {
//             subscription: latestExpPurchase['productId'],
//             state: 'expired',
//             date: latestExpPurchase['date'],
//             expDate: latestExpPurchase['expDate']
//         };
//     }
// } else {  // no purchases retrieved
//     // returns default storeResult:  state: 'never'
// }
//         }
//         catch (err) {
//     console.log('restorePurchase error', err);
// }
// return storeResult;
//     }
