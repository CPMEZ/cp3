import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { ConnectionProvider } from '../providers/connection/connection';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  timer: any;
  // constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    constructor(platform: Platform, 
      statusBar: StatusBar) {
      // conn:  ConnectionProvider) {
      platform.ready().then(() => {
        this.timer = setTimeout(() => {
          // just wait a bit, see if that cures plugin problems
          this.rootPage = WelcomePage;
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          statusBar.styleDefault();
          // splashScreen.hide();
          console.log('cordova?', platform.is('cordova'));
          // // is this a good place to subscribe to network connection?
          // conn.checkConnection();
          // console.log('connection subscribe');
          // conn.connectionSubscribe();
        }, 200);
    });
  }
}

