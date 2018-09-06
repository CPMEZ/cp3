import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TermsPage } from '../terms/terms';
import { SubscribePage } from '../subscribe/subscribe';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  done() {
    this.navCtrl.pop();
  }
  
  // terms() {
  //   this.navCtrl.push(TermsPage);
  // }

  subscribe() {
    this.navCtrl.push(SubscribePage);
  }
}
