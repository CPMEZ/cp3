import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { EditPlanPage } from '../edit-plan/edit-plan';
import { EditProblemPage } from '../edit-problem/edit-problem';
import { EditGoalPage } from '../edit-goal/edit-goal';
import { EditInterventionPage } from '../edit-intervention/edit-intervention';
import { AddProblemPage } from '../add-problem/add-problem';
import { AddGoalPage } from '../add-goal/add-goal';
import { AddInterventionPage } from '../add-intervention/add-intervention';
import { AddConditionPage } from '../add-condition/add-condition';
import { CopyPage } from '../copy/copy';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
// import { TextPlanPage } from '../text-plan/text-plan';

@IonicPage()
@Component({
  selector: 'page-contents',
  templateUrl: 'contents.html',
})
export class ContentsPage {
  plan: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider) {
    this.plan = navParams.get('plan');
  }
  
  ionViewDidEnter() {
  console.log('ionViewDidEnter ContentsPage');
  }

  // ionViewWillLeave() {
  //   console.log('ionViewWillLeave ContentsPage');
  //   this.PPP.write();
  // }

  ionViewCanEnter(): boolean {
    console.log('ionViewCanEnter ContentsPage');
    // save if returning from add or edit page, problem, goal, or intervention
    // else ignore
    let v = this.navCtrl.last();
    if ((v.component === AddConditionPage)
      || (v.component === AddProblemPage)
      || (v.component === AddGoalPage)
      || (v.component === AddInterventionPage)
      || (v.component === EditPlanPage)
      || (v.component === EditProblemPage)
      || (v.component === EditGoalPage)
      || (v.component === EditInterventionPage)) {
      this.PPP.write();
      return true;
    }
  }

  editPlan() {
    this.navCtrl.push(EditPlanPage, {
      plan: this.plan
    });
  }

  toggleProblemExpand(problem) {
    if (problem.expanded) {
        problem.expanded = false;
      problem.icon = "arrow-dropright";
      } else {
        problem.expanded = true;
      problem.icon = "arrow-dropdown";
      }
  }

  conditionAdd() {
    this.navCtrl.push(AddConditionPage, {
      plan: this.plan
    });
  }

  problemAdd() {
    this.navCtrl.push(AddProblemPage, {
      plan: this.plan
    });
  }

  problemEdit(problem) {
    this.navCtrl.push(EditProblemPage, {
      plan: this.plan,
      problem: problem
    });
  }
  
  problemDelete(problem) {
    var p: number = this.plan.problems.indexOf(problem, 0)
    if (p > -1) {
      this.plan.problems.splice(p, 1);
    }
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();    
    this.PPP.write();
  }
  
  goalAdd(problem) {
    this.navCtrl.push(AddGoalPage, {
      plan: this.plan,      
      problem: problem
    });
  }
  
  goalEdit(goal) {
    this.navCtrl.push(EditGoalPage, {
      plan: this.plan,
      goal: goal
    });
  }
  
  goalDelete(problem, goal) {
    var p: number = this.plan.problems.indexOf(problem, 0)
    if (p > -1) {
      var g: number = this.plan.problems[p].goals.indexOf(goal, 0)
      if (g > -1) {
        this.plan.problems[p].goals.splice(g, 1);
      }
    }
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();    
    this.PPP.write();
  }
  
  interventionAdd(problem) {
    this.navCtrl.push(AddInterventionPage, {
      plan: this.plan,
      problem: problem
    });
  }
  
  interventionEdit(intervention) {
    this.navCtrl.push(EditInterventionPage, {
      plan: this.plan,
      intervention: intervention
    });
  }
  
  interventionDelete(problem, intervention) {
    var p: number = this.plan.problems.indexOf(problem, 0)
    if (p > -1) {
        var n: number = this.plan.problems[p].interventions.indexOf(intervention, 0)
          if (n > -1) {
            this.plan.problems[p].interventions.splice(n, 1);
          }        
    }
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();    
    this.PPP.write();
  }
  
  showPrint() {
    // this.navCtrl.push(TextPlanPage, {
    //   plan: this.plan
    // });
  } 

  copyPlan() {
    this.navCtrl.push(CopyPage, {
      plan: this.plan
    });
  } 
  
  deletePlan() {
    this.PPP.deletePlan(this.plan);
    this.navCtrl.pop();
  }

  discList(int: any): string {
    let discText: string = "";
    if (int.interdisciplinary) { discText += "Interdisciplinary "}
    if (int.nursing) { discText += "Nursing "}
    if (int.aide) { discText += "Aide "}
    if (int.bereavement) { discText += "Bereavement "}
    if (int.dietary) { discText += "Dietary "}
    if (int.music) { discText += "Music/Other "}
    if (int.OT) { discText += "OT "}
    if (int.PT) { discText += "PT "}
    if (int.pharmacist) { discText += "Pharmacist "}
    if (int.social) { discText += "Social Work "}
    if (int.spiritual) { discText += "Spiritual Counselor "}
    if (int.speech) { discText += "Speech "}
    if (int.volunteer) { discText += "Volunteer "}
    if (int.other) { discText += int.other}
    return discText;
  }

}
