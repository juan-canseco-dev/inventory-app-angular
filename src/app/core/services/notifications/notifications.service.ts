import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  showNotification(icon, message, from, align, type)  {


    const template = `
    <div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">
      <button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>
      <i class="material-icons" data-notify="icon">${icon}</i> 
      <span data-notify="message">{2}</span>
    </div>
    `;

    $.notify({
      icon: icon,
      message: message
  },{
      type: type,
      timer: 4000,
      placement: {
          from: from,
          align: align
      },
      template: template
  });
  }
}
