import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-topic-menu',
  templateUrl: 'topic-menu.html',
})
export class TopicMenuPage {
  item: any;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.item = navParams.get('item');
  }

   close(opt: any) {
    console.log('p=', this.item);
    this.viewCtrl.dismiss(opt, this.item);
  }
}
