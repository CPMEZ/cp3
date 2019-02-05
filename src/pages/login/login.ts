import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { HelpPage } from '../help/help';
import { ConnectionProvider } from '../../providers/connection/connection';
import { SubselectPage } from '../subselect/subselect';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { TermsPage } from '../terms/terms';
import { WelcomePage } from '../welcome/welcome';
import { CarePlanPage } from '../careplan/careplan';

// TODO this should use oauth, google, facebook, linkedin

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userId: string;
  pwd: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private loadCtrl: LoadingController,
    public conn: ConnectionProvider,
    public MPP: MasterPlansProvider,
    public PPP: PersonalPlansProvider,
    public auth: AuthenticationProvider) {
    this.userId = this.auth.user;
    console.log('Login constructor: user', this.userId);
    conn.checkConnection();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.pwd = '';  // ensure local pwd not retained from prior uses
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave LoginPage');
    this.events.unsubscribe('loadComplete');
  }

  async login() {
    this.auth.user = this.userId.trim().toLowerCase();
    this.auth.password = this.pwd;
    try {
      await this.auth.authenticate();
      if (this.auth.userLoggedIn) {
        this.goToWork();
      } else {
        // OR just stay here, make 'em go back on their own
        // BUT they may want to choose subscribe, if log in failed
        // AND might have failed bc expired

        
        // goes back to wherever, which would be
        // careplanpage or wecomepage
        // this.navCtrl.pop();
      }
    }
    catch (err) { alert('UserId or Password not recognized'); }
  }

  goToWork() {
    // this logic repeated in welcome.ts
    console.log('loading plans from login');
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
      // console.log(this.navCtrl.getViews());
      // reset the stack, so that "back" goes to welcome instead of login
      this.navCtrl.setPages([{page: WelcomePage}, {page: CarePlanPage}]);
    })
    // insurance
    setTimeout(() => {
      try {
        loading.dismiss();
      }
      catch (err) { console.log('load complete before timeout'); }
    }, 5000);
  }
  
  subscribe() {
    this.navCtrl.push(SubselectPage);
  }
  
  workOffline() {
    // proceed without signing in
    // reset the stack, so that "back" goes to welcome instead of login
    // console.log(this.navCtrl.getViews());
    this.navCtrl.setPages([{ page: WelcomePage }, { page: CarePlanPage }]);
  }

  help() {
    this.navCtrl.push(HelpPage);
  }

  showTerms() {
    this.navCtrl.push(TermsPage);
  }
}
