import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SampleDetailPage } from '../sample-detail/sample-detail';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { SubselectPage } from '../subselect/subselect';

@IonicPage()
@Component({
  selector: 'page-sample',
  templateUrl: 'sample.html',
})
export class SamplePage {

  itemsList = [
      { text: "Alzheimer's & Dementia" },
      { text: "Amyotrophic Lateral Sclerosis (ALS)" },
      { text: "Bedridden" },
      { text: "Brain Tumor" },
      { text: "Breast Cancer" },
      { text: "Cancer" },
      { text: "Cardiac" },
      { text: "Cerebrovascular accident (CVA)" },
      { text: "Children" },
      { text: "Constipation & Impaction" },
      { text: "Depression & Psychiatric" },
      { text: "Diabetes" },
      { text: "Functional Decline" },
      { text: "Enteral & Total parenteral nutrition (TPN)" },
      { text: "Head & Neck Cancer" },
      { text: "Hospice Nurse" },
      { text: "Human Immunodeficiency Virus/Acquired Immune Deficiency Syndrome (HIV/AIDS)" },
      { text: "Imminent Death" },
      { text: "Infection Control and Prevention" },
      { text: "Infusion" },
      { text: "Lung/Respiratory" },
      { text: "Ostomy" },
      { text: "Oxygen Use" },
      { text: "Pain Management" },
      { text: "Prostate Cancer" },
      { text: "Renal Disease" },
      { text: "Urinary Catheter" },
      { text: "Wound and Pressure Injury" }
    ]


  constructor(private navCtrl: NavController, 
    public auth: AuthenticationProvider) {
  }

  showAlz() {
    this.navCtrl.push(SampleDetailPage);
  }

  subscribe() {
    this.navCtrl.push(SubselectPage);
  }

}
