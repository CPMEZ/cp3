import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
// import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { SubscribePage } from '../subscribe/subscribe';
import { TermsPage } from '../terms/terms';

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
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private plt: Platform,
    private iap: InAppPurchase) {
      if (this.plt.is('cordova')) {
        this.initStore();
      }
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad SubselectPage');
    }
    
    async initStore() {
      // TODO:  check validateReceipt to see if they've ever
      //      subscribed before, to decide whether to present introductory
      // TODO change button label to "renew" if they're already subscribed?
    console.log('initStore');
    try {
      this.products = await this.iap.getProducts(['CP3SubMonthly', 'CP3SubAnnual']);
      console.log('products', JSON.stringify(this.products));
    }
    catch(err) {
      console.log('store error', err);
    }
    // this.iap.getProducts(['CP3SubMonthly', 'CP3SubAnnual'])
    //   .then((prods) => {
    //     console.log('products', prods);
    //     this.products = prods;
    //   })
    //   .catch((err) => { console.log('store error', err); })
  }

  subscribe(p) {
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
      // alert(p.productId);
      this.iap.subscribe(p.productId)
      // this.iap.subscribe('CP3SubMonthly')
        .then((data) => {
          loading.dismiss();
          console.log('subscribe success', data);
          this.success = true;
          let prompt = this.alertCtrl.create({
            title: 'Subscribed!',
            message: 'Welcome to the Red Book.',
            buttons: [ { text: "Continue", role: 'cancel' } ]
          });
          prompt.present()
            .then(() => {
              this.navCtrl.push(SubscribePage, { id: p.productId });
            });
        })
        .catch((err) => {
          loading.dismiss();
          this.success = false;
          console.log('subscribe error', err);
          let prompt = this.alertCtrl.create({
            title: 'Store Error',
            message: 'Unable to complete purchase.',
            buttons: [ { text: "Continue", role: 'cancel' } ]
          });
          prompt.present();
        })

    } else {
      // redirect to the web store, someday?
      let prompt = this.alertCtrl.create({
        title: 'Sorry',
        message: 'You may only subscribe from a mobile device.',
        buttons: [ { text: "Continue", role: 'cancel' } ]
      });
      prompt.present();
    }
  }

  test() {
    // if (this.plt.is('browser')) {
      this.navCtrl.push(SubscribePage, { id: 'CP3SubMonthly' });
    // }
  }

  cancelEdit() {
    this.navCtrl.pop();
  }
  
  seeTerms() {
    this.navCtrl.push(TermsPage);
  }
}
