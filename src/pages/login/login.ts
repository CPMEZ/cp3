import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { CarePlanPage } from '../careplan/careplan';
import { HelpPage } from '../help/help';
// import { SubscribePage } from '../subscribe/subscribe';

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
    public MPP: MasterPlansProvider, 
    private auth: AuthenticationProvider) {
    const logout: boolean = this.navParams.get('logout');
    if (logout) {
      this.userId = "";
      this.pwd = "";
      this.auth.userId = "";
      this.auth.pwd = "";
      this.auth.userLoggedIn = false;
      alert("You are logged out of Red Book.  You can still work with your plans on your device.");
      this.editDone();
    } else {
      this.userId = this.auth.userId;
      this.pwd = this.auth.pwd;
      console.log('in user', this.userId);
      console.log('in pwd', this.pwd);
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  editDone() {
    this.auth.userId = this.userId;
    this.auth.pwd = this.pwd;
    console.log('done user', this.auth.userId);
    console.log('done pwd', this.auth.pwd);
    this.auth.authenticate();
    this.navToCarePlan();
  }
  
  navToCarePlan() {
    this.navCtrl.setRoot(CarePlanPage);
  }
  // subscribe() {
  //   this.navCtrl.push(SubscribePage, {
  //     userId: this.userId,
  //     pwd: this.pwd,
  //   });
  // }

  cancelEdit() {
    // proceed without signing in
    this.navCtrl.setRoot(CarePlanPage);
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
}
