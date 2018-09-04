import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';


@IonicPage()
@Component({
  selector: 'page-copy',
  templateUrl: 'copy.html',
})
export class CopyPage {
  plan: any;
  newPlan: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public PPP: PersonalPlansProvider) {
    this.plan = navParams.get('plan');
    if (!this.plan.text) { this.plan.text = "";}
    // initialize newPlan (just name and text)
    this.newPlan = { 
      name: "",
      text: ""
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CopyPage');
  }

  makeCopy() {
    this.PPP.copyPlan(this.plan, this.newPlan);
    this.navCtrl.pop();
  }
  
  cancelCopy() {
    this.navCtrl.pop();
  }

}
