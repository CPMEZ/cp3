import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CarePlanPage } from '../careplan/careplan';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {
  userId: string;
  pwd: string;
  pwdVer: string;
  myKey: string;
  myKeyVer: string;

// TODO change button label to "renew" if they're already subscribed?
// NOTE!! don't think we can ever change the key once established, or encrypted plans wouldn't be de-cryptable

// login disables subscribe button if the user is subscribed, so they can't get here
//    but it only works after first login on app load, cause we don't know yet

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider) {
      this.userId = this.auth.userId;
      this.pwd = this.auth.pwd;
      console.log(this.userId, this.pwd);
      this.initPurchase();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  initPurchase() {

  }

  subscribe() {
    // check:
    // current subscription
    // expired subscription
    // can make payments--if not, don't show the subscribe at all

    // call the payment ui here
    // if successful, create a new user profile on web storage
    this.auth.userId = this.userId;
    this.auth.pwd = this.pwd;
    this.auth.userKey = this.myKey;


    // this.navCtrl.setRoot(LoginPage);
    // TODO OR then sign them in (which might be too async?)
    this.auth.authenticate();
    this.navCtrl.setRoot(CarePlanPage);
  }
  cancelEdit() {
    this.navCtrl.pop();
  }
}
