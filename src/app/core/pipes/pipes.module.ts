import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOfRecordsMessagePipe } from './number-of-records-message';

@NgModule({
  declarations: [
    NumberOfRecordsMessagePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberOfRecordsMessagePipe
  ]
})
export class PipesModule { }
