import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { CarePlanPage } from '../careplan/careplan';
import { ConnectionProvider } from '../../providers/connection/connection';
import { TermsPage } from '../terms/terms';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  acceptedTerms = false;
  onLine = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private loadCtrl: LoadingController,
    public auth: AuthenticationProvider,
    public conn: ConnectionProvider,
    public PPP: PersonalPlansProvider) {
    console.log('Constructor Welcome');
    conn.checkConnection();
    this.auth.alreadyLoggedIn()
      .then((r) => {
        if (this.auth.userLoggedIn) {
          this.auth.checkSubscription();
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }


  ionViewWillUnload() {
    console.log('ionViewWillUnload WelcomePage');
    this.events.unsubscribe('loadComplete');
  }

  goToWork() {
    // this logic repeated in login.ts
    console.log('loading plans from welcome');
    let loading = this.loadCtrl.create({
      content: 'Getting your plans...'
    });
    loading.present();
    this.PPP.loadPlans();
    // cause we don't have async on loadPlans,
    this.events.subscribe('loadComplete', (time) => {
      console.log('got event loadComplete');
      try { loading.dismiss(); }
      catch (err) { console.log('load timeout before complete'); }
      this.navCtrl.setRoot(CarePlanPage);
    })
    // insurance
    setTimeout(() => {
      // console.log('in timer');
      try { loading.dismiss(); 
      }
      catch (err) { console.log('load complete before timeout'); }
    }, 5000);
  }


  login() {
    this.navCtrl.setRoot(LoginPage);
  }

  // alreadyLoggedIn() {
  //   this.navCtrl.setRoot(CarePlanPage);
  // }
  // workOffline() {
  //   this.navCtrl.setRoot(CarePlanPage);
  // }

  showTerms() {
    this.navCtrl.push(TermsPage);
  }

}
