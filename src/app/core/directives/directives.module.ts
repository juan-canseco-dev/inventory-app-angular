import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadDirective } from './file-upload';
import { NoCacheSrcDirective } from './no-cache-src/no-cache-src.directive';


@NgModule({
  declarations: [FileUploadDirective, NoCacheSrcDirective],
  imports: [
    CommonModule
  ],
  exports: [
    FileUploadDirective,
    NoCacheSrcDirective
  ]
})
export class DirectivesModule { }
