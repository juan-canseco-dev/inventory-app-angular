import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[appFileUpload]'
})
export class FileUploadDirective {

  @Output() filesDropped = new EventEmitter<FileList>();

  @HostBinding('class.drop-zone__hovered') fileOver : boolean;

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener ('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    console.log('Drag Leave');
  }
  
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.filesDropped.emit(files);
    }
  }

  constructor() { }

}
