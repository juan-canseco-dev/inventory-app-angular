import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[noCacheSrc]'
})
export class NoCacheSrcDirective {
  
  @Input() noCacheSrc : string;

  @HostBinding('src')
  get src() {
    const timestamp = new Date().getTime();
    return `${this.noCacheSrc}?${timestamp}`;
  }

}
