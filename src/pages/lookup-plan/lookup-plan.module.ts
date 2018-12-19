import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LookupPlanPage } from './lookup-plan';

@NgModule({
  declarations: [
    LookupPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(LookupPlanPage),
  ],
})
export class LookupPlanPageModule {}
