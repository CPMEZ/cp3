import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanMenuPage } from './plan-menu';

@NgModule({
  declarations: [
    PlanMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanMenuPage),
  ],
})
export class PlanMenuPageModule {}
