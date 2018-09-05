import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-add-plan',
  templateUrl: 'add-plan.html',
})
export class AddPlanPage {
  newPlan: { name: string, text: string, created: string, updated: string } = { name: "", text: "", created: "", updated: "" };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public auth: AuthenticationProvider, 
    public PPP: PersonalPlansProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlanPage');
  }

  addPlan() {
    // console.log(this.newPlan.name, this.newPlan.text);
    const d: Date = new Date();
    this.newPlan.created = d.toLocaleDateString();
    this.newPlan.updated = d.toLocaleDateString();
    this.PPP.addPlan(this.newPlan);
    this.navCtrl.pop();
  }

  cancelEdit() {
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
          handler: () => { this.auth.logout(); }
        }
      ]
    });
    prompt.present();
  }
}
