import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPlanPage } from './edit-plan';

@NgModule({
  declarations: [
    EditPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPlanPage),
  ],
})
export class EditPlanPageModule {}
