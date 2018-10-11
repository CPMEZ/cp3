import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDisciplinePage } from './add-discipline';

@NgModule({
  declarations: [
    AddDisciplinePage,
  ],
  imports: [
    IonicPageModule.forChild(AddDisciplinePage),
  ],
})
export class AddDisciplinePageModule {}
