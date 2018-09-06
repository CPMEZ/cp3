import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CarePlanPage } from '../careplan/careplan';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  acceptedTerms = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  continue() {
    this.navCtrl.push(LoginPage);
  }
  
  gotoPlans() {
    this.navCtrl.push(CarePlanPage);
  }

}
