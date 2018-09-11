import { Component } from '@angular/core';
import { Toast } from '@ionic-native/toast';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPage } from '../lookup/lookup';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-add-condition',
  templateUrl: 'add-condition.html',
})
export class AddConditionPage {
  plan: any;
  condition: {} = {};
  // problem: {} = {};
  // problems: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private toast: Toast,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider,
    public auth: AuthenticationProvider) {
    // plan to which problem added
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddConditionPage');
  }

  ionViewDidEnter() {
    // may have come from add, may have returned from selection
    console.log('ionViewDidEnter AddConditionPage');
    this.condition["text"] = "";
    if (this.MPP.listSelection) {
      this.condition = this.MPP.listSelection;
      console.log(this.condition);
      // clear it immediately after used
      this.MPP.listSelection = "";
    }
  }

  lookupMaster() {
    this.navCtrl.push(LookupPage, {
      types: "conditions",
      type: "condition",
      item: this.condition
    });
  }

  populateProblems() {
    // get the list of problems associated with a condition,
    // add the list to the plan
    this.MPP.getMaster(this.condition["file"])
      .then(data => {
        const cond: {} = JSON.parse(data);
        cond["condition"]["problems"].forEach(p => {
          p["icon"] = "arrow-dropdown";
          p["expanded"] = true;
          this.plan.problems.push(p);
        });
      });
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    if (this.condition) this.populateProblems();
    // if (this.plt.is('cordova')) {
    this.toast.show('Added ' + this.condition["text"], '1500', 'center').subscribe( t => {});
    // }
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
          handler: () => { this.auth.logout(); }
        }
      ]
    });
    prompt.present();
  }
}
