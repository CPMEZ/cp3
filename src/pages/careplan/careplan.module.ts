import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarePlanPage } from './careplan';

@NgModule({
  declarations: [
    CarePlanPage,
  ],
  imports: [
    IonicPageModule.forChild(CarePlanPage),
  ],
})
export class CarePlanPageModule {}
