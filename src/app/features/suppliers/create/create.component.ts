import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateSupplierRequest, Address } from 'app/core/models/backend/suppliers';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { SuppliersService } from 'app/core/services/suppliers';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  parent : FormGroup;
  loading : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private fb : FormBuilder,
    private suppliersService : SuppliersService,
    private notificationService : NotificationsService,
    private router : Router) { }

  ngOnInit(): void {
    this.parent = this.fb.group({
      companyName: [null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      }],
      contactName : [null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      }],
      contactPhone: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(20)
        ]
      }],
      country: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }],
      state: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }],
      city: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }],
      zipCode: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(10)
        ]
      }],
      line1: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }],
      line2: [null, {
        validators: [
          Validators.maxLength(50)
        ]
      }]
    });
  }

  ngOnDestroy() : void {
    this.subscriptions$.unsubscribe();
  }

  private createSupplier() {
    this.loading = true;

    const value = this.parent.value;

    const address : Address = {
      country: value.country,
      state: value.state,
      city: value.city,
      zipCode: value.zipCode,
      line1: value.line1,
      line2: value.line2
    };

    const request: CreateSupplierRequest = {
      companyName: value.companyName,
      contactName: value.contactName,
      contactPhone : value.contactPhone,
      address: address
    };

    this.subscriptions$.add(
      this.suppliersService.createSupplier(request).subscribe({
        next: () => {
          this.router.navigateByUrl('suppliers');
          this.notificationService.showNotification('done', 'Supplier created successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.loading = false;
          if (error.status === 422 || error.status === 400) {
            this.notificationService.showNotification('error', error.error.title, 'bottom', 'center', 'danger');
            return;
          }
          this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
          console.log(error);
        }
      })
    );
  }

  onSubmit() : void {
    if (!this.parent.valid) {
      return;
    }
    this.createSupplier();
  }

  get contactName() {
    return this.parent.get('contactName');
  }

  get companyName() { 
    return this.parent.get('companyName');
  }

  get contactPhone() {
    return this.parent.get('contactPhone');
  }

  get country() {
    return this.parent.get('country');
  }

  get state() {
    return this.parent.get('state');
  }

  get city() {
    return this.parent.get('city');
  }

  get zipCode() {
    return this.parent.get('zipCode');
  }

  get line1() { 
    return this.parent.get('line1');
  }

  get line2() {
    return this.parent.get('line2');
  }
  
}
