import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContentsPage } from '../contents/contents';
import { AddPlanPage } from '../add-plan/add-plan';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { CacheProvider } from '../../providers/cache/cache';

@IonicPage()
@Component({
  selector: 'page-careplan',
  templateUrl: 'careplan.html',
})
export class CarePlanPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toast: Toast,
    public auth: AuthenticationProvider,
    private cache: CacheProvider,
    public PPP: PersonalPlansProvider) {
    this.plt.pause.subscribe(() => {
      this.PPP.write();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CareplanPage');
    console.log('loading plans');
    // wait indicator
    let loading = this.loadCtrl.create({
      content: 'Getting the list...'
    });
    loading.present();
    this.PPP.loadPlans();
    // cause we don't have async on loadPlans,
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
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
          handler: () => { this.auth.logout(); }
        }
      ]
    });
    prompt.present();
  }
}


