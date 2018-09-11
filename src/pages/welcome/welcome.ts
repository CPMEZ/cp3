import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { CarePlanPage } from '../careplan/careplan';
import { ConnectionProvider } from '../../providers/connection/connection';

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
    private auth: AuthenticationProvider,
    public conn:  ConnectionProvider) {
      if (this.auth.alreadyLoggedIn()) {
        this.auth.checkSubscription();
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  alreadyLoggedIn() {
    this.navCtrl.setRoot(CarePlanPage);
  }

  login() {
    this.navCtrl.setRoot(LoginPage);
  }
  
  workOffline() {
    this.navCtrl.setRoot(CarePlanPage);
  }

}
