import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
// import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { SubscribePage } from '../subscribe/subscribe';
import { TermsPage } from '../terms/terms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-subselect',
  templateUrl: 'subselect.html',
})


// subselect comes first where purchase is done; 
// then comes subscribe, where account is set up
export class SubselectPage {
  userId: string;
  pwd: string;
  pwdVer: string;
  myKey: string;
  myKeyVer: string;
  products: any;
  success: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthenticationProvider,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private plt: Platform,
    private iap: InAppPurchase) {
    // this.auth.reportState('constructor subselect');
    if (this.plt.is('cordova')) {
      this.initStore();
    } else {
      this.mockInitStore();
    }
  }

  mockInitStore() {
    console.log('mockInitStore');
    this.products = [
      {
        title: 'CP3SubMonthly',
        price: 5.99
      }
    ]
  }

  async initStore() {
    // TODO:  check validateReceipt to see if they've ever
    //      subscribed before, to decide whether to present introductory
    try {
      this.products = await this.iap.getProducts(['CP3SubMonthly']);
      // alert('PRODUCTS' + JSON.stringify(this.products));
    }
    catch (err) {
      console.log('store error', err);
    }
  }

  subscribe(p, rs) {
    // check:
    // can make payments--if not, don't show the subscribe at all
    if (this.plt.is('cordova')) {
      let loading = this.loadCtrl.create({
        content: 'Purchasing subscription...'
      });
      loading.present();
      // alert(p.productId);  // debug on device
      this.iap.subscribe(p.productId)
        .then((data) => {
          // TODO?  may need to "consume" purchase on android
          // return iap.consume(data.productType, data.receipt, data.signature);
          loading.dismiss();
          console.log('subscribe success', data);
          this.success = true;
          let prompt = this.alertCtrl.create({
            title: (rs == 'subscribe') ? 'Subscribed!' : 'Renewed!',
            message: 'Welcome to the Red Book.',
            buttons: [{ text: "Continue", role: 'cancel' }]
          });
          prompt.present()
            .then(() => {
              if (rs === 'subscribe') {
                this.navCtrl.push(SubscribePage, { id: p.productId });
              } else { // ==='renew'
                // authenticate, go to plans page
                // authenticate includes reconcileSubscription 
                //  which will resolve newly-renewed sub
                this.auth.authenticate().then(() => {
                  this.navCtrl.setRoot(WelcomePage);
                });
              }
            });
        })
        .catch((err) => {
          loading.dismiss();
          this.success = false;
          console.log('subscribe error', err);
          let prompt = this.alertCtrl.create({
            title: 'Store Error',
            message: 'Unable to complete purchase.',
            buttons: [{ text: "Continue", role: 'cancel' }]
          });
          prompt.present()
            .then(() => {
              // go back to where we came from
              this.navCtrl.pop();
            });
        })
    } else {
      // redirect to the web store, someday?
      let prompt = this.alertCtrl.create({
        title: 'Sorry',
        message: 'You may only subscribe from a mobile device.',
        buttons: [{ text: "Continue", role: 'cancel' }]
      });
      prompt.present()
        .then(() => {
          // go back to where we came from
          this.navCtrl.pop();
        });
    }
    // }
    // MOCK =====================================
    // for testing on browser
    // let loading = this.loadCtrl.create({
    //   content: 'Purchasing subscription...'
    // });
    // loading.present();
    // loading.dismiss();
    // console.log('subscribe success');
    // this.success = true;
    // let prompt = this.alertCtrl.create({
    //   title: (rs == 'subscribed') ? 'Subscribed!' : 'Renewed!',
    //   message: 'Welcome to the Red Book.',
    //   buttons: [{ text: "Continue", role: 'cancel' }]
    // });
    // prompt.present()
    //   .then(() => {
    //     if (rs === 'subscribe') {
    //       this.navCtrl.push(SubscribePage, { id: p.productId });
    //     } else { // ==='renew'
    //       // authenticate, go to plans page
    //       // authenticate includes reconcileSubscription 
    //       //  which will resolve newly-renewed sub
    //       this.auth.authenticate().then(() => {
    //         this.navCtrl.setRoot(WelcomePage);
    //       });
    //     }
    //   });
    // MOCK =====================================
    // }
  }

  // test() {
  //   // if (this.plt.is('browser')) {
  //   this.navCtrl.push(SubscribePage, { id: 'CP3SubMonthly' });
  //   // }
  // }

  cancelEdit() {
    this.navCtrl.pop();
  }

  seeTerms() {
    this.navCtrl.push(TermsPage);
  }
}
