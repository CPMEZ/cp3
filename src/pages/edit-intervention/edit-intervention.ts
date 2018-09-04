import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-edit-intervention',
  templateUrl: 'edit-intervention.html',
})
export class EditInterventionPage {
  plan: any;
  intervention: any;
  saveIntervention: { text: "" } = { text: "" };
  // remember to undo the radio button too
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.plan = navParams.get('plan');
    this.intervention = navParams.get('intervention');
    this.saveIntervention.text = this.intervention.text;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditInterventionPage');
  }
  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();    
    this.navCtrl.pop();
  }
  cancelEdit() {
    // undo on cancel
    this.intervention.text = this.saveIntervention.text;
    this.navCtrl.pop();
  }
}
