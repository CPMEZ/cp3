import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
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
  myKey: string;
  myKeyVer: string;
  products: any;

  // TODO change button label to "renew" if they're already subscribed?
  // NOTE!! don't think we can ever change the key once established, or encrypted plans wouldn't be de-cryptable

  // login disables subscribe button if the user is subscribed, so they can't get here
  //    but it only works after first login on app load, cause we don't know yet

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private plt: Platform,
    public auth: AuthenticationProvider) {
    this.userId = this.auth.userId;
    this.pwd = this.auth.pwd;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  setup() {
    // TODO also check for active internet connection
    // WORKING HERE
    // subscribe trans success,
    // now create our new user on cpapi

    if (this.plt.is('cordova')) {
      let loading = this.loadCtrl.create({
        content: 'Setting up...'
      });
      loading.present();
      this.auth.userId = this.userId;
      this.auth.pwd = this.pwd;
      this.auth.userKey = this.myKey;
      this.auth.createSubscription()
        .then(() => {
          // sucessful
          loading.dismiss;
          let prompt = this.alertCtrl.create({
            title: 'Set Up Complete!',
            buttons: [{ text: "Continue", role: 'cancel' }]
          });
          prompt.present()
            .then(() => {
              this.auth.authenticate();
              this.navCtrl.setRoot(CarePlanPage);
            })
            // failed
            .catch(() => {
              loading.dismiss;
              let prompt = this.alertCtrl.create({
                title: 'Problem:',
                message: 'Set up did not complete correctly',
                buttons: [{ text: "Continue", role: 'cancel' }]
              });
              prompt.present()
                .then(() => {
                  this.navCtrl.setRoot(CarePlanPage);
                })
            });
        })
    }
  }
}
