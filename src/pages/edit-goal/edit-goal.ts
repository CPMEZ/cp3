import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-edit-goal',
  templateUrl: 'edit-goal.html',
})
export class EditGoalPage {
  plan: any;
  goal: any;
  saveGoal: { text: "" } = { text: "" };
  // remember to undo the checkbox too
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider) {
    this.plan = navParams.get('plan');
    this.goal = navParams.get('goal');
    this.saveGoal.text = this.goal.text;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditGoalPage');
  }
  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.navCtrl.pop();
  }
  cancelEdit() {
    // undo on cancel
    this.goal.text = this.saveGoal.text;
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
  login() {
    this.navCtrl.push(LoginPage);
  }
  logout() {
    this.auth.logout();
  }     
}