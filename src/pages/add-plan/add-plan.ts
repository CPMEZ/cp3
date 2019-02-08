import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPlanPage } from '../lookup-plan/lookup-plan';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';

@IonicPage()
@Component({
  selector: 'page-add-plan',
  templateUrl: 'add-plan.html',
})
export class AddPlanPage {
  condition: {};
  newPlan: { name: string, text: string, created: string, updated: string } = { name: "", text: "", created: "", updated: "" };
  canUseName: boolean;
  planToMerge: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private plt: Platform,
    private toast: Toast,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider) {
  }

  nameChange(){
    // console.log('checking');
    this.canUseName = this.PPP.checkPlanName(this.newPlan['name'].trim());
    // console.log('checking=', this.canUseName);
  }

  addPlan(type: string) {
    // console.log(this.newPlan.name, this.newPlan.text);
    if (this.PPP.checkPlanName(this.newPlan['name'])) {}
    this.PPP.addPlan(this.newPlan, type);
    if (this.plt.is('mobile')) {
      this.toast.show('Added ' + this.newPlan['name'], '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }

  stdPlan() {
    // newPlan should have name & text from this page
    // new plan is otherwise empty at this point
    this.navCtrl.push(LookupPlanPage, {
      types: "conditions",
      type: "condition",
      searchName: "Condition",
      target: this.newPlan,
      fromPage: 'plans'      
    });
  }

  copyPlan() {
    this.navCtrl.push(LookupPlanPage, {
      types: "",
      type: "My Plan",
      searchName: "Your Plan",
      target: this.newPlan,
      fromPage: 'plans'
    });
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
