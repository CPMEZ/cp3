import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Events, AlertController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { CarePlanPage } from '../careplan/careplan';
import { ConnectionProvider } from '../../providers/connection/connection';
import { TermsPage } from '../terms/terms';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { SamplePage } from '../sample/sample';
// import { InAppBrowserOriginal } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  acceptedTerms = false;
  onLine = false;

  constructor(public navCtrl: NavController,
    public events: Events,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private iab: InAppBrowserOriginal,
    public auth: AuthenticationProvider,
    public conn: ConnectionProvider,
    public PPP: PersonalPlansProvider) {
    console.log('Constructor Welcome');
    conn.checkConnection();
    if (this.auth.firstTime) {
      this.auth.authenticate()
        .then((r) => { this.auth.firstTime = false; });
    }
  }

  ionViewWillUnload() {
    this.events.unsubscribe('loadComplete');
  }

  workOnline() {
    console.log('welcome workOnline');
    // this logic repeated in login.ts
    // console.log('loading plans from welcome');
    let loading = this.loadCtrl.create({
      content: 'Getting your plans...'
    });
    loading.present();
    this.PPP.loadPlans();
    // cause we don't have async on loadPlans,
    this.events.subscribe('loadComplete', (time) => {
      // console.log('got event loadComplete');
      try {
        loading.dismiss();
        // console.log('on loading complete event, plans =', this.PPP.plans);
      }
      catch (err) { console.log('load timeout before complete'); }
      // this.navCtrl.push(CarePlanPage);
      this.navCtrl.setPages([{ page: WelcomePage }, { page: CarePlanPage }]);
    })
    // insurance
    setTimeout(() => {
      // console.log('in timer');
      try {
        loading.dismiss();
      }
      catch (err) { console.log('load complete before timeout'); }

    }, 5000);
  }

  workOffline() {
    console.log('welcome workOffline');
    // currently just does workOnline()
    // but might want to logout, 
    //    OR set userLoggedIn=false, 
    //    OR just read local plans, 
    //    OR ???
    this.workOnline();
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  logout() {
    // confirm before logout
    let prompt = this.alertCtrl.create({
      title: 'Confirm Log Out',
      buttons: [
        {
          text: "No, don't log out",
          role: 'cancel'
        },
        {
          text: 'Yes, log out',
          handler: () => {
            // this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }

  // video() {
  //   alert('video');
  //   //  window.open("https://marrelli.com/app-support/video/rbhowto.mp4", '_system', 'location=yes');
  //   // this.iab.create("http://google.com");
  // }

  previewStd() {
    this.navCtrl.push(SamplePage);
  }
  showTerms() {
    this.navCtrl.push(TermsPage);
  }

}
