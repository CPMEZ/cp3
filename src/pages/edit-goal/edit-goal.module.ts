import { NgModule } from '@angular/core';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditGoalPage } from './edit-goal';

@NgModule({
  declarations: [
    EditGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditGoalPage),
  ],
})
export class EditGoalPageModule {}
