import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPage } from '../lookup/lookup';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-add-goal',
  templateUrl: 'add-goal.html',
})
export class AddGoalPage {
  plan: any;
  problem: any;
  goal: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider,
    public auth: AuthenticationProvider) {
    // problem to which goal added
    this.plan = navParams.get('plan');
    this.problem = navParams.get('problem');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGoalPage');
  }

  ionViewDidEnter() {
    // may have come from add, may have returned from selection
    console.log('ionViewDidEnter AddGoalPage');
    this.goal["text"] = "";
    this.goal["hint"] = "";
    if (this.MPP.listSelection) {
      this.goal = this.MPP.listSelection;
      // clear it immediately after used
      this.MPP.listSelection = "";
    }
    // note these are initialized even if goal is taken from master list
    this.goal["term"] = (!!this.goal["term"]) ? this.goal["term"] : "ST";
  }

  lookupMaster() {
    this.navCtrl.push(LookupPage, {
      types: "goals",
      type: "goal",
      searchName: "Outcome",
      planName: this.plan.name,      
      item: this.goal
    });
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.problem.goals.push(this.goal);
    this.PPP.write();
    if (this.plt.is('mobile')) {
      this.toast.show('Outcome Added', '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }
  cancelEdit() {
    // exit w/o save
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
            this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }
}
