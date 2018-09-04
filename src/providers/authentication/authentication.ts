import { Injectable } from '@angular/core';
import { CPAPI } from '../cpapi/cpapi';

@Injectable()
export class AuthenticationProvider {

    constructor(private cpapi: CPAPI) {
        console.log('Constructor AuthenticationProvider Provider');
    }

    userLoggedIn: boolean = false;
    userId: string = "";
    pwd: string = "";
    userKey: string = "";
    renewal: string = "";
    renewalType: string = "";
    clientKey: string = "";  // for payments--TODO, might drop this

    WARN_DAYS: number = 5;

    authenticate(): any {
        // exit if no credentials
        console.log('authenticate', this.userId, this.pwd);
        if ((!this.userId) || (!this.pwd)) {
            // either one missing 
            this.userLoggedIn = false;
            return this.userLoggedIn;
        }
        // TODO encrypt pwd before send
        var path = this.cpapi.apiURL + "user/" + this.userId + "?p=" + this.pwd;
        this.cpapi.getData(path).then((data) => {
            const d = JSON.parse(data);
            console.log('authenticate.then');
            console.log(d);
            if (d) {
                this.userKey = d.key;
                this.renewal = d.renewal;
                this.renewalType = d.renewalType;
                if (this.checkSubscription()) {
                    this.userLoggedIn = true;
                    return this.userLoggedIn;
                } else { // subscription expired
                    this.userLoggedIn = false;
                    return this.userLoggedIn;
                }
            } else {  // no data, bad credentials
                this.userLoggedIn = false;
                return this.userLoggedIn;
            }
        });
    }

    checkSubscription(): boolean {
        // exit if no renewal value
        if (!this.renewal) return false;
        // use credentials to check last renewal date
        let userValidSubscription: boolean = false;
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
                userValidSubscription = false;
            } else if (duration < this.WARN_DAYS) {
                expiredMessage = "Your subscription to Marrelli's Red Book Care Plans expires in " + (duration + 1).toString() + " days.  Please renew to continue building Red Book-based Care Plans.";
                alert(expiredMessage);
                userValidSubscription = true;
            } else {
                // not expired
                userValidSubscription = true;
            }
            return userValidSubscription
        }
    }    

    logout() {
        this.userLoggedIn = false;
        this.userId= "";
        this.pwd = "";
        this.userKey = "";
        this.renewal = "";
        this.renewalType = "";
        this.clientKey = "";  // for payments--TODO, might drop this
    }
}