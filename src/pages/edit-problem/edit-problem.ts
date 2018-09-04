import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-edit-problem',
  templateUrl: 'edit-problem.html',
})
export class EditProblemPage {
  plan: any;
  problem: any;
  saveProblem: { text: "" } = { text: "" };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.plan = navParams.get('plan');
    this.problem = navParams.get('problem');
    this.saveProblem.text = this.problem.text;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProblemPage');
  }
  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();    
    this.navCtrl.pop();
  }
  cancelEdit() {
    // undo on cancel
    this.problem.text = this.saveProblem.text;
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
}
