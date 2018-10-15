import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { Toast } from '@ionic-native/toast';
import { LocalStoreProvider } from '../providers/local-store/local-store';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

import { MyApp } from './app.component';

import { MasterPlansProvider } from '../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CPAPI } from '../providers/cpapi/cpapi';
import { PersonalPlansProvider } from '../providers/personal-plans/personal-plans';

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
import { CopyPage } from '../pages/copy/copy';
import { TermsPage } from '../pages/terms/terms';
import { LookupPage } from '../pages/lookup/lookup';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { TextPlanPage } from '../pages/text-plan/text-plan';
import { SubselectPage } from '../pages/subselect/subselect';
import { ConnectionProvider } from '../providers/connection/connection';
import { Network } from '@ionic-native/network';

import { DragulaModule } from 'ng2-dragula';
import { AddDisciplinePage } from '../pages/add-discipline/add-discipline';
import { CacheProvider } from '../providers/cache/cache';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    CarePlanPage,
    ContentsPage,
    AddPlanPage,
    AddDisciplinePage,
    AddConditionPage,
    AddProblemPage,
    AddGoalPage,
    AddInterventionPage,
    LookupPage,
    EditPlanPage,
    EditProblemPage,
    EditGoalPage,
    EditInterventionPage,
    CopyPage,
    TextPlanPage,
    HelpPage,
    TermsPage,
    SubscribePage,
    SubselectPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    DragulaModule.forRoot()  // ngDragula documentation says this way
    // DragulaModule // example at devdactic says this way--prolly cause example single page
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
    AddDisciplinePage,
    AddProblemPage,
    AddGoalPage,
    AddInterventionPage,
    LookupPage,    
    EditPlanPage,
    EditProblemPage,
    EditGoalPage,
    EditInterventionPage,
    CopyPage,
    TextPlanPage,
    HelpPage,
    TermsPage,
    SubscribePage,
    SubselectPage,
  ],
  providers: [
    AuthenticationProvider,
    CPAPI,
    LocalStoreProvider,
    MasterPlansProvider,
    PersonalPlansProvider,
    ConnectionProvider,
    StatusBar,
    Storage,
    File,
    EmailComposer,
    DocumentViewer,
    Toast,
    Network,
    Clipboard,
    InAppPurchase,
    // SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CacheProvider,
  ]
})
export class AppModule {}
