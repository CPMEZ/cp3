import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-plan-menu',
  templateUrl: 'plan-menu.html',
})
export class PlanMenuPage {

  constructor(public viewCtrl: ViewController) {
  }

  close(opt: any) {
    this.viewCtrl.dismiss(opt);
  }

}
