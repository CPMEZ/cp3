import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { EditPlanPage } from '../edit-plan/edit-plan';
import { EditProblemPage } from '../edit-problem/edit-problem';
import { EditGoalPage } from '../edit-goal/edit-goal';
import { EditInterventionPage } from '../edit-intervention/edit-intervention';
import { AddProblemPage } from '../add-problem/add-problem';
import { AddGoalPage } from '../add-goal/add-goal';
import { AddInterventionPage } from '../add-intervention/add-intervention';
// import { AddConditionPage } from '../add-condition/add-condition';
// import { AddDisciplinePage } from '../add-discipline/add-discipline';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { TextPlanPage } from '../text-plan/text-plan';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
// import { MergePage } from '../merge/merge';
// import { MergeProvider } from '../../providers/merge/merge';
import { LookupPlanPage } from '../lookupPlan/lookupPlan';

@IonicPage()
@Component({
  selector: 'page-contents',
  templateUrl: 'contents.html',
})
export class ContentsPage {
  plan: any;

  ddChanges: boolean = false;
  nowDragging: boolean = false;
  subs = new Subscription();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private ds: DragulaService,
    private alertCtrl: AlertController,
    public auth: AuthenticationProvider,
    public PPP: PersonalPlansProvider) {
    this.plan = navParams.get('plan');

    // dragging stuff
    // disable scroll when dragging
    document.addEventListener('touchstart', (e) => {
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      // console.log('touchmove event', this.nowDragging);
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });

    this.subs.add(this.ds.drag()
      .subscribe(({ name }) => {
        this.nowDragging = true;
        // console.log('drag event', name, this.nowDragging);
      })
    );
    this.subs.add(this.ds.dragend()
      .subscribe(({ name }) => {
        this.nowDragging = false;
        // console.log('dragend event', name, this.nowDragging);
      })
    );

    // drag/drop events
    this.subs.add(this.ds.dropModel("goal-list")
      .subscribe(({ el, targetModel }) => {
        this.nowDragging = false;
        // reassignment to this.plans.problems[].xxx replaces arraw w/newly-sequenced one,
        // should not work if they drag out of one problem to another
        const t = el.getElementsByClassName('probId');
        const c = parseInt(t[0].innerHTML);
        this.plan.problems[c].goals = targetModel;
        this.ddChanges = true;
      })
    );

    this.subs.add(this.ds.dropModel("int-list")
      .subscribe(({ name, el, targetModel }) => {
        this.nowDragging = false;
        // reassignment to this.plans.problems[].xxx replaces arraw w/newly-sequenced one,
        // should not work if they drag out of one problem to another
        const t = el.getElementsByClassName('probId');
        const c = parseInt(t[0].innerHTML);
        this.plan.problems[c].interventions = targetModel;
        this.ddChanges = true;
      })
    );
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ContentsPage');
    this.ddChanges = false;  // init/re-init on load
    // let v = this.navCtrl.last();
    // if ((v.component === MergePage) && (this.PPP.listSelection > "")) {
    //   // do the merge
    //   this.finishMerge();
    // }
  }


  ionViewWillLeave() {
    console.log('ionViewWillLeave ContentsPage');
    // this.subs.unsubscribe();
    // document.removeEventListener('touchmove', () => { });
    // document.removeEventListener('touchend', () => { });
    if (this.ddChanges) {
      this.PPP.write();
      this.ddChanges = false;  // reset after save
    }
    // console.log(this.subs);
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload ContentsPage');
    this.subs.unsubscribe();
    document.removeEventListener('touchmove', () => { });
    document.removeEventListener('touchend', () => { });
  }

  // private finishMerge() {
  //   // confirm before copy
  //   let prompt = this.alertCtrl.create({
  //     title: 'Confirm Add ' + this.PPP.listSelection["name"],
  //     buttons: [
  //       {
  //         text: "No, don't add",
  //         role: 'cancel',
  //         handler: () => {
  //           this.navCtrl.pop();
  //         }
  //       },
  //       {
  //         text: 'Yes, please',
  //         handler: () => {
  //           console.log(this.PPP.listSelection);
  //           this.merge.mergePlans(this.plan, this.PPP.listSelection);
  //           this.PPP.listSelection = "";  // clear after use
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

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
    this.navCtrl.push(LookupPlanPage, {
      types: "conditions",
      type: "condition",
      searchName: "Condition",
      target: this.plan,
      fromPage: 'contents'
    });
  }

  disciplineAdd() {
    console.log('discplineAdd');
      this.navCtrl.push(LookupPlanPage, {
        types: "disciplines",
        type: "discipline",
        searchName: "Discipline",
        target: this.plan,
        fromPage: 'contents'
      });
    }

  mergeIn() {
    this.navCtrl.push(LookupPlanPage, {
      types: "",
      type: "My Plan",
      searchName: "Your Plan",
      target: this.plan,
      fromPage: 'contents'
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
    // confirm before delete
    let prompt = this.alertCtrl.create({
      title: 'Confirm Delete',
      buttons: [
        {
          text: "No, don't delete",
          role: 'cancel'
        },
        {
          text: 'Yes, delete',
          handler: () => {
            var p: number = this.plan.problems.indexOf(problem, 0)
            if (p > -1) {
              this.plan.problems.splice(p, 1);
            }
            const d: Date = new Date();
            this.plan.updated = d.toLocaleDateString();
            this.PPP.write();
          }
        }
      ]
    });
    prompt.present();
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
    // no confirmation
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
    // no confirmation
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
    this.navCtrl.push(TextPlanPage, {
      plan: this.plan
    });
  }

  deletePlan() {
    // confirm before delete
    let prompt = this.alertCtrl.create({
      title: 'Confirm Delete',
      buttons: [
        {
          text: "No, don't delete",
          role: 'cancel'
        },
        {
          text: 'Yes, delete',
          handler: () => {
            this.PPP.deletePlan(this.plan);
            this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

  discList(int: any): string {
    let discText: string = "";
    if (int.interdisciplinary) { discText += "Interdisciplinary " }
    if (int.nursing) { discText += "Nursing " }
    if (int.aide) { discText += "Aide " }
    if (int.bereavement) { discText += "Bereavement " }
    if (int.dietary) { discText += "Dietary " }
    if (int.music) { discText += "Music/Other " }
    if (int.OT) { discText += "OT " }
    if (int.PT) { discText += "PT " }
    if (int.pharmacist) { discText += "Pharmacist " }
    if (int.social) { discText += "Social Work " }
    if (int.spiritual) { discText += "Spiritual Counselor " }
    if (int.speech) { discText += "Speech " }
    if (int.volunteer) { discText += "Volunteer " }
    if (int.other) { discText += int.other }
    return discText;
  }

  goalTerm(goal: any): string {
    if (goal.term) {
      if (goal.term === "ST") {
        return "Short Term";
      } else {
        return "Long Term";
      }
    }
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
