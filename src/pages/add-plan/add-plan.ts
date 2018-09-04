import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-add-plan',
  templateUrl: 'add-plan.html',
})
export class AddPlanPage {
  newPlan: { name: string, text: string, created: string, updated: string } = { name: "", text: "", created: "", updated: "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public PPP: PersonalPlansProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlanPage');
  }

  addPlan() {
    // console.log(this.newPlan.name, this.newPlan.text);
    const d: Date = new Date();
    this.newPlan.created = d.toLocaleDateString();
    this.newPlan.updated = d.toLocaleDateString();
    this.PPP.addPlan(this.newPlan);
    this.navCtrl.pop();
  }

  cancelEdit() {
    this.navCtrl.pop();
  }
}
