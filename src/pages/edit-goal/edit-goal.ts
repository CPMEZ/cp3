import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

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
    private alertCtrl: AlertController,    
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider) {
    this.plan = navParams.get('plan');
    this.goal = navParams.get('goal');
    this.saveGoal.text = this.goal.text;
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.PPP.write();
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
}