import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
// import { StatusBar } from '@ionic-native/status-bar';
// import { ConnectionProvider } from '../providers/connection/connection';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  timer: any;
  // constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  constructor(platform: Platform
    , splashScreen: SplashScreen) {
    // ){
    // , statusBar: StatusBar) {
    // conn:  ConnectionProvider) {
    platform.ready().then(() => {
      this.rootPage = WelcomePage;
      // for ios quirks
      if (platform.is('cordova')) {
        this.timer = setTimeout(() => {
          splashScreen.hide();
        }, 2000);
      }
    });
  }
}

