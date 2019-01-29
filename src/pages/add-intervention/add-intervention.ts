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
  selector: 'page-add-intervention',
  templateUrl: 'add-intervention.html',
})
export class AddInterventionPage {
  plan: any;
  problem: any;
  intervention: {} = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider,
    public auth: AuthenticationProvider) {
    // problem to which intervention added
    this.plan = navParams.get("plan");
    this.problem = navParams.get("problem");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInterventionPage');
  }

  ionViewDidEnter() {
    // may have come from add, may have returned from selection
    console.log('ionViewDidEnter AddInterventionPage');
    this.intervention["text"] = "";
    this.intervention["hint"] = "";
    if (this.MPP.listSelection) {
      this.intervention = this.MPP.listSelection;
      console.log('selected intervention', this.intervention);
      // clear it immediately after used
      this.MPP.listSelection = "";
    }
    // note these are initialized even if intervention is taken from master list
    if (!this.problem.interventions) this.problem["interventions"] = [] as any;
    this.intervention["interdisciplinary"] = false;
    this.intervention["nursing"] = false;
    this.intervention["aide"] = false;
    this.intervention["bereavement"] = false;
    this.intervention["dietary"] = false;
    this.intervention["music"] = false;
    this.intervention["OT"] = false;
    this.intervention["PT"] = false;
    this.intervention["pharmacist"] = false;
    this.intervention["social"] = false;
    this.intervention["spiritual"] = false;
    this.intervention["speech"] = false;
    this.intervention["volunteer"] = false;
    this.intervention["other"] = "";
  }

  lookupMaster() {
    this.navCtrl.push(LookupPage, {
      types: "interventions",
      type: "intervention",
      searchName: "Intervention",
      planName: this.plan.name + ': ' + this.problem.text,      
      item: this.intervention
    });
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.problem.interventions.push(this.intervention);
    this.PPP.write();    
    if (this.plt.is('mobile')) {
      this.toast.show('Intervention Added', '1500', 'center').subscribe(t => { });
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
            // this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }
}