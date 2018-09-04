import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { MasterPlansProvider } from '../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CPAPI } from '../providers/cpapi/cpapi';
import { PersonalPlansProvider } from '../providers/personal-plans/personal-plans';
import { LocalStoreProvider } from '../providers/local-store/local-store';

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { CarePlanPage } from '../pages/careplan/careplan';
import { EditPlanPage } from '../pages/edit-plan/edit-plan';
import { ContentsPage } from '../pages/contents/contents';
import { AddPlanPage } from '../pages/add-plan/add-plan';
import { AddConditionPage } from '../pages/add-condition/add-condition';
import { AddProblemPage } from '../pages/add-problem/add-problem';
import { AddGoalPage } from '../pages/add-goal/add-goal';
import { AddInterventionPage } from '../pages/add-intervention/add-intervention';
import { EditProblemPage } from '../pages/edit-problem/edit-problem';
import { EditGoalPage } from '../pages/edit-goal/edit-goal';
import { EditInterventionPage } from '../pages/edit-intervention/edit-intervention';
import { HelpPage } from '../pages/help/help';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    CarePlanPage,
    ContentsPage,
    AddPlanPage,
    AddConditionPage,
    AddProblemPage,
    AddGoalPage,
    AddInterventionPage,
    EditPlanPage,
    EditProblemPage,
    EditGoalPage,
    EditInterventionPage,
    HelpPage,
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
    ContentsPage,
    AddPlanPage,
    AddConditionPage,
    AddProblemPage,
    AddGoalPage,
    AddInterventionPage,
    EditPlanPage,
    EditProblemPage,
    EditGoalPage,
    EditInterventionPage,
    HelpPage,
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
