import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { CarePlanPage } from '../careplan/careplan';
import { HelpPage } from '../help/help';
import { ConnectionProvider } from '../../providers/connection/connection';
import { SubselectPage } from '../subselect/subselect';

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
    public conn: ConnectionProvider,
    public MPP: MasterPlansProvider, 
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
    console.log('after Login editDone: user', this.auth.userId);
    console.log('after Login editDone: pwd', this.auth.pwd);
    this.auth.authenticate().then( (result) => { this.navToCarePlan(); });
  }
  
  navToCarePlan() {
    this.navCtrl.setRoot(CarePlanPage);
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
