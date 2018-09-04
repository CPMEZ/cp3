import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { LookupPage } from '../lookup/lookup';

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
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider) {
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
      item: this.goal
    });
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    this.problem.goals.push(this.goal);
    this.navCtrl.pop();
  }
  cancelEdit() {
    // exit w/o save
    this.navCtrl.pop();
  }
}
