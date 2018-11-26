import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPage } from '../lookup/lookup';
import { HelpPage } from '../help/help';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-add-problem',
  templateUrl: 'add-problem.html',
})
export class AddProblemPage {
  plan: any;
  problem: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider,
    public auth: AuthenticationProvider) {
    // plan to which problem added
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProblemPage');
  }

  ionViewDidEnter() {
    // may have come from add, may have returned from selection
    console.log('ionViewDidEnter AddProblemPage');
    this.problem["text"] = "";
    this.problem["hint"] = "";
    if (this.MPP.listSelection) {
      this.problem = this.MPP.listSelection;
      // clear it immediately after used
      this.MPP.listSelection = "";
    }
    // note these are initialized even if problem is taken from master list
    if (!this.problem["goals"]) {
      this.problem["goals"] = [] as any[];
    }
    if (!this.problem["interventions"]) {
      this.problem["interventions"] = [] as any[];
    }
    this.problem["expanded"] = true;
    this.problem["icon"] = "arrow-dropdown";
  }

  lookupMaster() {
    this.navCtrl.push(LookupPage, {
      types: "problems",
      type: "problem",
      searchName: "Topic",
      planName: this.plan.name,
      item: this.problem
    });
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.plan.problems.push(this.problem);
    this.PPP.write();    
    if (this.plt.is('mobile')) {
      this.toast.show('Topic Added', '1500', 'center').subscribe(t => { });
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
