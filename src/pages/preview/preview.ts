import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  plan: any;
  type: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
    this.plan = navParams.get('plan');
    this.type = navParams.get('type');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewPage');
  }

  discList(int: any): string {
    let discText: string = "";
    if (int.interdisciplinary) { discText += "Interdisciplinary, " }
    if (int.nursing) { discText += "Nursing, " }
    if (int.aide) { discText += "Aide, " }
    if (int.bereavement) { discText += "Bereavement, " }
    if (int.dietary) { discText += "Dietary, " }
    if (int.music) { discText += "Music/Other, " }
    if (int.OT) { discText += "OT, " }
    if (int.PT) { discText += "PT, " }
    if (int.pharmacist) { discText += "Pharmacist, " }
    if (int.social) { discText += "Social Work, " }
    if (int.spiritual) { discText += "Spiritual Counselor, " }
    if (int.speech) { discText += "Speech, " }
    if (int.volunteer) { discText += "Volunteer, " }
    if (int.other) { discText += int.other }
    // strip off trailing ", " if any
    discText = discText.trim();
    const lastChar = discText.substr(-1, 1);
    if (lastChar == ",") {
      discText = discText.substr(0, discText.length - 1);
    }
    return discText;
  }


  cancelEdit() {
    // exit w/o save
    this.navCtrl.pop();
  }
}
