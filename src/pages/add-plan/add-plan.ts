import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPage } from '../lookup/lookup';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { MergePage } from '../merge/merge';

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlanPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AddPlanPage');
    // may have returned from add condition selection
    // if so, continue with processing the add
    if (this.MPP.listSelection) {
      this.finishAddStandard();
      this.MPP.listSelection = "";
    } // else entered initially vs returned
    if (this.PPP.listSelection) {
      this.finishCopyPlan();
      this.PPP.listSelection = "";
    } // else entered initially vs returned
  }

  private finishCopyPlan() {
    // complete adding a copied care plan
    // after re-entry from merge
    console.log('finishCopyPlan');
    this.planToMerge = this.PPP.listSelection;
    // clear it immediately after used
    this.PPP.listSelection = "";
    // confirm before copy
    let prompt = this.alertCtrl.create({
      title: 'Confirm Add ' + this.planToMerge["name"],
      buttons: [
        {
          text: "No, don't add",
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Yes, please',
          handler: () => {
            this.PPP.copyPlan(this.planToMerge, this.newPlan);
            if (this.plt.is('mobile')) {
              this.toast.show('Added ' + this.newPlan['name'], '1500', 'center').subscribe(t => { });
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

  private finishAddStandard() {
    // complete adding a standard care plan
    // after re-entry from lookup
    console.log('finishAddStandard');
    this.condition = this.MPP.listSelection;
    // clear it immediately after used
    this.MPP.listSelection = "";
    // confirm before copy
    let prompt = this.alertCtrl.create({
      title: 'Confirm Add ' + this.condition["text"],
      buttons: [
        {
          text: "No, don't add",
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Yes, please',
          handler: () => {
            this.PPP.standardPlan(this.newPlan, this.condition);
            if (this.plt.is('mobile')) {
              this.toast.show('Added ' + this.newPlan['name'], '1500', 'center').subscribe(t => { });
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

  nameChange(){
    // console.log('checking');
    this.canUseName = this.PPP.checkPlanName(this.newPlan['name'].trim());
    // console.log('checking=', this.canUseName);
  }

  addPlan() {
    // console.log(this.newPlan.name, this.newPlan.text);
    if (this.PPP.checkPlanName(this.newPlan['name'])) {}
    this.PPP.addPlan(this.newPlan);
    if (this.plt.is('mobile')) {
      this.toast.show('Added ' + this.newPlan['name'], '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }

  stdPlan() {
    // newPlan should have name & text from this page
    this.navCtrl.push(LookupPage, {
      types: "conditions",
      type: "condition",
      searchName: "Condition",
      planName: this.newPlan['name'],      
      item: this.condition
    });
    // process continues when return from selection
  }

  // mergePlan() {
  //   this.navCtrl.push(MergePage, {
  //     planName: this.newPlan['name'],
  //     planText: this.newPlan['text']
  //   })
  // }

  copyPlan() {
    this.navCtrl.push(MergePage, {
      planName: this.newPlan['name'],
      planText: this.newPlan['text']
    })
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
            this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }
}
