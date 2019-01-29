import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleDetailPage } from './sample-detail';

@NgModule({
  declarations: [
    SampleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SampleDetailPage),
  ],
})
export class SampleDetailPageModule {}
