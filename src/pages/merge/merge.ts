import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPage } from '../help/help';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

@IonicPage()
@Component({
  selector: 'page-merge',
  templateUrl: 'merge.html',
})
export class MergePage {

  types: string;
  type: string;
  searchTerm: string;
  searchName: string;
  planName: string;
  itemsList: any;
  item: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public PPP: PersonalPlansProvider) {
    this.planName = this.navParams.get('planName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MergePage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter MergePage');
    this.getList();
  }

  getList() {
    this.itemsList = this.PPP.listPlans();
  }

  choose(which) {
    // console.log('selected', which);
    this.PPP.listSelection = which;
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
}
