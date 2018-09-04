import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInterventionPage } from './add-intervention';

@NgModule({
  declarations: [
    AddInterventionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddInterventionPage),
  ],
})
export class AddInterventionPageModule {}
