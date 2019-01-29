import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
// import { CarePlanPage } from '../careplan/careplan';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { WelcomePage } from '../welcome/welcome';

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
    private alertCtrl: AlertController,
    private plt: Platform,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider) {
    this.userId = this.auth.user;
    this.pwd = this.auth.password;
    this.productId = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscribePage');
  }

  setup() {
    // subscribe trans success,
    // now create our new user on cpapi

    // TODO need an android version?  no platform-specific stuff in here--do in createSubscription
    if (this.plt.is('ios')) {
    this.auth.user = this.userId;
    this.auth.password = this.pwd;
    this.auth.key = this.myKey;
    this.auth.createSubscription(this.productId)
      .then((a) => { 
        // create sucessful
        console.log('subscription created=',a);
        let prompt = this.alertCtrl.create({
          title: 'Set Up Complete!',
          buttons: [{
            text: 'Continue', role: 'cancel',
            handler: () => {
              this.auth.authenticate().then(() => {
                // save the new user's previously-created plans
                //    initializes server-stored plans when empty
                this.PPP.pushWeb();
                this.navCtrl.setRoot(WelcomePage);
              });
            }
          }]
        });
        prompt.present();
      })
      // create failed
      .catch((b) => {
        console.log('subscription created=',b);
        let prompt = this.alertCtrl.create({
          title: 'Problem:',
          message: 'Set up did not complete correctly',
          buttons: [{
            text: "Continue", role: 'cancel',
            handler: () => {
              this.navCtrl.setRoot(WelcomePage);
            }
          }]
        });
        prompt.present();
      });
    }
  }

  checkAvail() {
    this.auth.checkUser(this.userId)
      .then((d) => { this.uidAvail = d; })
  }

}
