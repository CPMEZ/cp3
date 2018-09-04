import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { CarePlanPage } from '../pages/careplan/careplan';
import { EditPlanPage } from '../pages/edit-plan/edit-plan';
import { MasterPlansProvider } from '../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CPAPI } from '../providers/cpapi/cpapi';
import { PersonalPlansProvider } from '../providers/personal-plans/personal-plans';
import { LocalStoreProvider } from '../providers/local-store/local-store';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    CarePlanPage,
    EditPlanPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    CarePlanPage,
    EditPlanPage,
  ],
  providers: [
    AuthenticationProvider,
    CPAPI,
    LocalStoreProvider,
    MasterPlansProvider,
    PersonalPlansProvider,
    StatusBar,
    Storage,
    // SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
