import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditInterventionPage } from './edit-intervention';

@NgModule({
  declarations: [
    EditInterventionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditInterventionPage),
  ],
})
export class EditInterventionPageModule {}
