import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddConditionPage } from './add-condition';

@NgModule({
  declarations: [
    AddConditionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddConditionPage),
  ],
})
export class AddConditionPageModule {}
