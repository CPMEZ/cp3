import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CarePlanPage } from '../careplan/careplan';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

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
    private iap: InAppPurchase,
    public auth: AuthenticationProvider) {
    this.userId = this.auth.userId;
    this.pwd = this.auth.pwd;
    console.log(this.userId, this.pwd);
    if (this.plt.is('cordova')) {
      this.initStore();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  initStore() {
    console.log('initStore');
    this.iap.getProducts(['CP3Subscription'])
      .then((prods) => {
        alert(prods);
        console.log('products', prods);
        this.products = prods;
      })
      .catch((err) => {
        console.log('store error', err);
      })
  }




  subscribe() {
    // check:
    // current subscription
    // expired subscription
    // can make payments--if not, don't show the subscribe at all
    // TODO also check for active internet connection
    if (this.plt.is('cordova')) {
      let loading = this.loadCtrl.create({
        content: 'Purchasing subscription...'
      });
      loading.present();

      this.iap.subscribe('CP3Subscription')
        .then((data) => {
          loading.dismiss();
          console.log('subscribe success', data);

// WORKING HERE  subscribe transaction worked for apple-sandbox-1
// now create our new user on cpapi
          
          // if successful, create a new user profile on web storage
          // this.auth.userId = this.userId;
          // this.auth.pwd = this.pwd;
          // this.auth.userKey = this.myKey;
          // this.auth.createSubscription();
          // TODO OR then sign them in (which might be too async?)
          // this.auth.authenticate();
          // this.navCtrl.setRoot(CarePlanPage);

          let prompt = this.alertCtrl.create({
            title: 'Subscribed!',
            message: 'Welcome to the Red Book.',
            buttons: [
              {
                text: "Continue",
                role: 'cancel'
              }
            ]
          });
          prompt.present();

        })
        .catch((err) => {
          loading.dismiss();
          console.log('subscribe error', err);
          let prompt = this.alertCtrl.create({
            title: 'Store Error',
            message: 'Unable to complete purchase.',
            buttons: [
              {
                text: "Continue",
                role: 'cancel'
              }
            ]
          });
          prompt.present();
        })

    } else {
      // redirect to the web store, someday?
      let prompt = this.alertCtrl.create({
        title: 'Sorry',
        message: 'You may only subscribe from a mobile device.',
        buttons: [
          {
            text: "Continue",
            role: 'cancel'
          }
        ]
      });
      prompt.present();
    }
  }
  cancelEdit() {
    this.navCtrl.pop();
  }
}
