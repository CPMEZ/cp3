import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProblemPage } from './edit-problem';

@NgModule({
  declarations: [
    EditProblemPage,
  ],
  imports: [
    IonicPageModule.forChild(EditProblemPage),
  ],
})
export class EditProblemPageModule {}
