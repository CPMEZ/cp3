import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-edit-plan',
  templateUrl: 'edit-plan.html',
})
export class EditPlanPage {
  plan: any;
  savePlan: { name: string, text: string, updated: string } = { name: "", text: "", updated: "" };
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider) {
    this.plan = navParams.get('plan');
    this.savePlan.name = this.plan.name;
    this.savePlan.text = this.plan.text;
    this.savePlan.updated = this.plan.updated;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPlanPage');
  }
  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.navCtrl.pop();
  }
  cancelEdit() {
    // undo on cancel
    this.plan.name = this.savePlan.name;
    this.plan.text = this.savePlan.text;
    this.plan.updated = this.savePlan.updated;
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
