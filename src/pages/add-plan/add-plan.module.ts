import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPlanPage } from './add-plan';

@NgModule({
  declarations: [
    AddPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPlanPage),
  ],
})
export class AddPlanPageModule {}
