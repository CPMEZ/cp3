import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { CarePlanPage } from '../careplan/careplan';
import { HelpPage } from '../help/help';
import { ConnectionProvider } from '../../providers/connection/connection';
import { SubselectPage } from '../subselect/subselect';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

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
    this.userId = this.auth.userId;
    console.log('Login constructor: user', this.userId);
    conn.checkConnection();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.auth.userId = this.userId.trim().toLowerCase();
    this.auth.pwd = this.pwd;
    // console.log('after Login editDone: user', this.auth.userId);
    // console.log('after Login editDone: pwd', this.auth.pwd);
    this.auth.authenticate()
      .then(result => this.goToWork(),
       err => alert('UserId or Password not recognized'));
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
      this.navCtrl.setRoot(CarePlanPage);
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

  subscribe() {
    // alert('Subscribing is not available during initial test');
    this.navCtrl.push(SubselectPage);
  }

  cancelEdit() {
    // proceed without signing in
    this.navCtrl.setRoot(CarePlanPage);
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
}
