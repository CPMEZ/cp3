import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LookupPlanPage } from './lookupPlan';

@NgModule({
  declarations: [
    LookupPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(LookupPlanPage),
  ],
})
export class LookupPlanPageModule {}
