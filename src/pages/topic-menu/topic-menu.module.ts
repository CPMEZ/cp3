import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicMenuPage } from './topic-menu';

@NgModule({
  declarations: [
    TopicMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicMenuPage),
  ],
})
export class TopicMenuPageModule {}
