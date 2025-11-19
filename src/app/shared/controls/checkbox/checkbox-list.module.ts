import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListComponent } from './checkbox-list.component';



@NgModule({
  declarations: [
    CheckboxListComponent
  ],
  imports: [
    CommonModule
  ],
  exports : [
    CheckboxListComponent
  ]
})
export class CheckboxListModule { }
