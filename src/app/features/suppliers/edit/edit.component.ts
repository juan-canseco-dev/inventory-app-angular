import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { SuppliersService } from 'app/core/services/suppliers';
import { EditSupplierRequest, Address } from 'app/core/models/backend/suppliers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  parent : FormGroup;
  loading : boolean = false;
  error : boolean = false;
  editing : boolean = false;

  private subscriptions$ = new Subscription();
  private supplierId : number;

  constructor(
    private suppliersService : SuppliersService,
    private notificationService : NotificationsService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params : Params) => {
      this.supplierId = params['supplierId'];
      this.getSupplierDetails();
    });

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

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
  
  getSupplierDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.suppliersService.getSupplierDetails(this.supplierId).subscribe({
        next: result => {
          this.loading = false;
          this.companyName.patchValue(result.companyName);
          this.contactName.patchValue(result.contactName);
          this.contactPhone.patchValue(result.contactPhone);
          this.country.patchValue(result.address.country);
          this.state.patchValue(result.address.state);
          this.city.patchValue(result.address.city);
          this.zipCode.patchValue(result.address.zipCode);
          this.line1.patchValue(result.address.line1);
          this.line2.patchValue(result.address.line2);
        },
        error: error => {
          if (error.status === 404) {
            this.router.navigateByUrl('/static/not-found');
            return;
          }
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  private updateSupplier() {
    this.editing = true;

    const value = this.parent.value;

    const address : Address = {
      country: value.country,
      state: value.state,
      city: value.city,
      zipCode: value.zipCode,
      line1: value.line1,
      line2: value.line2
    };

    const request: EditSupplierRequest = {
      supplierId : this.supplierId,
      companyName: value.companyName,
      contactName: value.contactName,
      contactPhone : value.contactPhone,
      address: address
    };

    this.subscriptions$.add(
      this.suppliersService.editSupplier(request).subscribe({
        next: () => {
          this.router.navigateByUrl('suppliers');
          this.notificationService.showNotification('done', 'Supplier Edited Successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.editing = false;
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

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    this.updateSupplier();
  }

  retry() {
    this.getSupplierDetails();
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
