import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  timer: any;
  constructor(platform: Platform,
              splashScreen: SplashScreen) {

    platform.ready().then(() => {
      console.log('platform ready')
      if (platform.is('cordova')) { console.log('cordova');}
      this.timer = setTimeout(() => {
        if (platform.is('cordova')) {
          // for ios quirks
          splashScreen.hide();
        }
        this.rootPage = WelcomePage;
      }, 2000);
    }); 
  }
}

