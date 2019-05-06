import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildPofile } from './child-pofile';
import IonicStepperModule from "ionic-stepper";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    ChildPofile,
  ],
  imports: [
    IonicPageModule.forChild(ChildPofile),
    IonicStepperModule,
    CommonModule
  ],
})
export class ChildPofilePageModule {}