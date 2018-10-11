import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { HelpPage } from '../help/help';

@IonicPage()
@Component({
  selector: 'page-lookup',
  templateUrl: 'lookup.html',
})
export class LookupPage {

  types: string;
  type: string;
  searchTerm: string;
  searchName: string;
  itemsList: any;
  item: any;

  constructor(public navCtrl: NavController,
    private lc: LoadingController,
    public navParams: NavParams,
    public MPP: MasterPlansProvider) {
      this.types = this.navParams.get('types');
      this.type = this.navParams.get('type');
      this.searchTerm = this.navParams.get('searchTerm');
      this.searchName = this.navParams.get('searchName');
      this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookupPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LookupPage');
    this.getList();
  }

  getList() {
    // wait indicator
    let loading = this.lc.create({
      content: 'Getting the list...'
    });
    loading.present();
    this.MPP.getMaster(this.types, this.searchTerm)
      .then((data) => {
        loading.dismiss();
        const d = JSON.parse(data);
        this.itemsList = d[this.types];
        // console.log(this.itemsList);
      });
  }

  choose(which) {
    this.MPP.listSelection = which;
    this.navCtrl.pop();
  }

  presentLoadingDefault() {
    let loading = this.lc.create({
      content: 'Getting the list...'
    });

    loading.present();

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 5000);
  }


  help() {
    this.navCtrl.push(HelpPage);
  }
}
