import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { ContentsPage } from '../contents/contents';
// import { AddPlanPage } from '../add-plan/add-plan';
// import { CopyPage } from '../copy/copy';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { EditPlanPage } from '../edit-plan/edit-plan';
import { ContentsPage } from '../contents/contents';
import { AddPlanPage } from '../add-plan/add-plan';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
// import { TextPlanPage } from '../text-plan/text-plan';
// import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-careplan',
  templateUrl: 'careplan.html',
})
export class CarePlanPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CareplanPage');
  }

  contents(plan) {
    this.navCtrl.push(ContentsPage, {
        plan: plan
      });
    }
    
  addPlan() {
    this.navCtrl.push(AddPlanPage, {
      });
    }
    
  // editPlan(plan) {
  //   this.navCtrl.push(EditPlanPage, {
  //     plan: plan
  //   });
  // }

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


