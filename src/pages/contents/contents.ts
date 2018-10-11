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
import { AddConditionPage } from '../add-condition/add-condition';
import { AddDisciplinePage } from '../add-discipline/add-discipline';
import { CopyPage } from '../copy/copy';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { TextPlanPage } from '../text-plan/text-plan';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

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

    document.addEventListener('touchstart', (e) => {
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });
    // document.addEventListener('touchend', (e) => {
    //   if (this.nowDragging) {
    //     e.preventDefault();
    //   }
    // }, { passive: false });
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

    this.subs.add(this.ds.dropModel()
      .subscribe(({ name, el, targetModel }) => {
        this.nowDragging = true;
        // reassignment to this.plans.problems[] fails if not explicit,
        //    this works on both source and target when dragging from one problem to another, 
        //      without assigning source explicitly.
        //      i don't understand it but it works. (so leave it alone)
        const t = el.getElementsByClassName('probId');
        const c = parseInt(t[0].innerHTML);
        if (name === "goal-list") {
          this.plan.problems[c].goals = targetModel;
          // console.log('goals', targetModel);
        } else {
          this.plan.problems[c].interventions = targetModel;
          // console.log('interventions', targetModel);
        }
        this.ddChanges = true;
      })
    );
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ContentsPage');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave ContentsPage');
    this.subs.unsubscribe();
    document.removeEventListener('touchmove', () => { });
    document.removeEventListener('touchend', () => { });
    if (this.ddChanges) this.PPP.write();
    // console.log(this.subs);
  }

  ionViewCanEnter(): boolean {
    console.log('ionViewCanEnter ContentsPage');
    // save if returning from add or edit page, problem, goal, or intervention
    // else ignore
    let v = this.navCtrl.last();
    if ((v.component === AddConditionPage)
      || (v.component === AddDisciplinePage)
      || (v.component === AddProblemPage)
      || (v.component === AddGoalPage)
      || (v.component === AddInterventionPage)
      || (v.component === EditPlanPage)
      || (v.component === EditProblemPage)
      || (v.component === EditGoalPage)
      || (v.component === EditInterventionPage)) {
      // console.log(this.plan);
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

  disciplineAdd() {
    this.navCtrl.push(AddDisciplinePage, {
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
              var g: number = this.plan.problems[p].goals.indexOf(goal, 0)
              if (g > -1) {
                this.plan.problems[p].goals.splice(g, 1);
              }
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
              var n: number = this.plan.problems[p].interventions.indexOf(intervention, 0)
              if (n > -1) {
                this.plan.problems[p].interventions.splice(n, 1);
              }
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

  showPrint() {
    this.navCtrl.push(TextPlanPage, {
      plan: this.plan
    });
  }

  copyPlan() {
    this.navCtrl.push(CopyPage, {
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
