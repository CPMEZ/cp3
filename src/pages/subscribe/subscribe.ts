import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CarePlanPage } from '../careplan/careplan';

@IonicPage()
@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {
  userId: string;
  pwd: string;
  pwdVer: string;

// TODO in-app purchase for subscription

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider) {
      this.userId = navParams.get("userId");
      this.pwd = navParams.get("pwd");
      console.log(this.userId, this.pwd);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  editDone() {
    // call the payment ui here
    // if successful, create a new user profile on web storage
    //  include generate a userKey or else use braintree clientKey
    this.auth.userId = this.userId;
    this.auth.pwd = this.pwd;
    // TODO then sign them in (which might be too async?)
    this.auth.authenticate();
    this.navCtrl.setRoot(CarePlanPage);
  }
}
