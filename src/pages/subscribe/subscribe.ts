import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CarePlanPage } from '../careplan/careplan';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {

  // subselect comes first where purchase is done; 
  // then comes subscribe, where account is set up

  userId: string;
  pwd: string;
  pwdVer: string;
  myKey: string;
  myKeyVer: string;
  products: any;
  uidAvail: boolean = false;

  productId: string;
  // TODO change button label to "renew" if they're already subscribed?
  // NOTE!! don't think we can ever change the key once established, or encrypted plans wouldn't be de-cryptable

  // login disables subscribe button if the user is subscribed, so they can't get here
  //    but it only works after first login on app load, cause we don't know yet

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private plt: Platform,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider) {
    this.userId = this.auth.userId;
    this.pwd = this.auth.pwd;
    this.productId = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  setup() {
    // WORKING HERE
    // subscribe trans success,
    // now create our new user on cpapi

    // TODO need an android version
    if (this.plt.is('ios')) {
      let loading = this.loadCtrl.create({
        content: 'Setting up...'
      });
      loading.present();
      this.auth.userId = this.userId;
      this.auth.pwd = this.pwd;
      this.auth.userKey = this.myKey;
      // if (!this.uidAvail) { this.checkAvail(); }
      this.auth.createSubscription(this.productId) 
        .then(() => {
          console.log('back from createSubscription');
          // sucessful
          loading.dismiss;
          let prompt = this.alertCtrl.create({
            title: 'Set Up Complete!',
            buttons: [{ text: "Continue", role: 'cancel' }]
          });
          prompt.present()
            .then(() => {
              this.auth.authenticate().then(() => {
                // save the new user's previously-created plans
                //    initializes server-stored plans even if empty
                this.PPP.pushWeb();
              });
              this.navCtrl.setRoot(CarePlanPage);
            })
        })
        // create failed
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
      // })
    }
  }

  checkAvail() {
    this.auth.checkUser(this.userId)
      .then((d) => { this.uidAvail = d; })
  }

}
