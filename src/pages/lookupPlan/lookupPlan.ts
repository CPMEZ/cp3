import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { HelpPage } from '../help/help';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { PreviewPage } from '../preview/preview';

@IonicPage()
@Component({
  selector: 'page-lookupPlan',
  templateUrl: 'lookupPlan.html',
})
export class LookupPlanPage {

  types: string;
  type: string;
  searchTerm: string;
  searchTitle: string;
  target: any;
  itemsList: any;
  fromPage: string;
  searchingMaster: boolean = true;

  constructor(public navCtrl: NavController,
    private lc: LoadingController,
    public navParams: NavParams,
    public MPP: MasterPlansProvider,
    public PPP: PersonalPlansProvider) {
    this.types = this.navParams.get('types');
    this.type = this.navParams.get('type');
    this.searchTerm = this.navParams.get('searchTerm');
    this.fromPage = this.navParams.get('fromPage');
    this.target = this.navParams.get('target');  // plan we're merging into
    this.searchTitle = "Searching for " + this.navParams.get('searchName') + " to be added to " + this.target["name"];
    if (this.type === 'condition'
      || this.type === 'discipline') {
      this.searchingMaster = true;
    } else {
      this.searchingMaster = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookupPlanPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LookupPlanPage');
    if (this.searchingMaster) {
      this.getMasterList();
    } else {
      this.getPersonalList();
    }
  }

  getMasterList() {
    let loading = this.lc.create({
      content: 'Getting the list...'
    });
    loading.present();
    this.MPP.getMaster(this.types, this.searchTerm)
      .then((data) => {
        loading.dismiss();
        const d = JSON.parse(data);
        this.itemsList = d[this.types];
      });
  }

  getPersonalList() {
    console.log('getPersonalList', this.PPP.listPlans());
    this.itemsList = this.PPP.listPlans();
  }

  choose(which) {
    if (this.searchingMaster) {
      this.getMaster(which);
    } else {
      this.getPersonal(which);
    }
  }

  getMaster(which: string) {
    // get the selected content, 
    // go to preview/select page
    console.log('getMaster', which);
    this.MPP.getMaster(which["file"])
      .then((data) => {
        console.log('getMaster', data );
        const d = JSON.parse(data);
        console.log('getMaster', d );
        console.log('d:type', this.type, d[this.type]);
        // nav to the preview page
        this.navCtrl.push(PreviewPage, {
          source: d[this.type],
          target: this.target,
          fromPage: this.fromPage,
          type: this.type
        });
      })

  }

  getPersonal(which: string) {
    // get the selected content, 
    // go to preview/select page
    console.log('getPersonal', which);
    // nav to the preview page
    this.navCtrl.push(PreviewPage, {
      source: which,
      target: this.target,
      fromPage: this.fromPage,
      type: this.type
    });
  }


  help() {
    this.navCtrl.push(HelpPage);
  }
}
