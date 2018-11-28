import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContentsPage } from '../contents/contents';
import { AddPlanPage } from '../add-plan/add-plan';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { CacheProvider } from '../../providers/cache/cache';

import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-careplan',
  templateUrl: 'careplan.html',
})
export class CarePlanPage {

  ddChanges: boolean = false;
  nowDragging: boolean = false;
  subs = new Subscription();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private alertCtrl: AlertController,
    // private loadCtrl: LoadingController,
    private toast: Toast,
    private ds: DragulaService,
    public auth: AuthenticationProvider,
    private cache: CacheProvider,
    public PPP: PersonalPlansProvider) {

    // event listeners
    // save if swapped out
    this.plt.pause.subscribe(() => {
      // think this fails because async takes too long?
      this.PPP.write();
    });

    // dragging stuff
    // disable scroll when dragging
    document.addEventListener('touchstart', (e) => {
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      // console.log('touchmove event', this.nowDragging);
      if (this.nowDragging) {
        e.preventDefault();
      }
    }, { passive: false });

    this.subs.add(this.ds.drag()
      .subscribe(({ name }) => {
        this.nowDragging = true;
        // console.log('drag event', name, this.nowDragging);
      })
    );
    this.subs.add(this.ds.dragend()
      .subscribe(({ name }) => {
        this.nowDragging = false;
        // console.log('dragend event', name, this.nowDragging);
      })
    );

    // drag/drop events
    this.subs.add(this.ds.dropModel("plan-list")
      .subscribe(({ el, targetModel }) => {
        this.nowDragging = false;
        // reassignment to this.plans.problems[] fails if not explicit,
        //    this works on both source and target when dragging from one problem to another, 
        //      without assigning source explicitly.
        //      i don't understand it but it works. (so leave it alone)
        const t = el.getElementsByClassName('planId');
        const c = parseInt(t[0].innerHTML);
        this.PPP.plans[c] = targetModel;
        this.ddChanges = true;
      })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CareplanPage');

    this.ddChanges = false;  // in/re-init on load
    // wait indicator
    // let loading = this.loadCtrl.create({
    //   content: 'Getting the list...'
    // });
    // loading.present();
    // this.PPP.loadPlans();
    // // cause we don't have async on loadPlans,
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 1500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CareplanPage');
    console.log('ddchanges', this.ddChanges);
    if (this.ddChanges) {
      this.PPP.write();
      this.ddChanges = false;  // reset after save--overkill if on exit from page
    }
    // console.log(this.subs);
  }
  
  ionViewWillUnload() {
    console.log('ionViewWillUnload CareplanPage');
    this.subs.unsubscribe();
    document.removeEventListener('touchmove', () => { });
    document.removeEventListener('touchend', () => { });
  }

  contents(plan) {
    this.navCtrl.push(ContentsPage, {
      plan: plan
    });
  }

  addPlan() {
    this.navCtrl.push(AddPlanPage, {
    });
  }

  pushToWeb() {
    this.PPP.saveToWeb();
    if (this.plt.is('mobile')) {
      this.toast.show('Uploaded to Cloud', '1500', 'center').subscribe(t => { });
    }
  }

  pullFromWeb() {
    this.PPP.loadPlansWeb();
    if (this.plt.is('mobile')) {
      this.toast.show('Downloaded from Cloud', '1500', 'center').subscribe(t => { });
    }
  }

  clearCache() {
    this.cache.clearCache();
    if (this.plt.is('mobile')) {
      this.toast.show('Cache Cleared', '1000', 'center').subscribe(t => { });
    }
  }

  help() {
    this.navCtrl.push(HelpPage);
  }
  login() {
    this.navCtrl.push(LoginPage);
  }
  logout() {
    // confirm before logout
    let prompt = this.alertCtrl.create({
      title: 'Confirm Log Out',
      buttons: [
        {
          text: "No, don't log out",
          role: 'cancel'
        },
        {
          text: 'Yes, log out',
          handler: () => {
            this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }
}


