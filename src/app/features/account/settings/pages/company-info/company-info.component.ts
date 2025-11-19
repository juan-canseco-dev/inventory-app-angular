import { Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCompanyInfo } from 'app/core/models/backend/settings';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { CompanyInfoService } from 'app/core/services/settings/company-info';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit, OnDestroy {

  photoFile: File | null = null;
  photoSrc : string;
  loadingDetails : boolean = false;

  updating : boolean = false;
  loadingError : boolean = false;
  form !: FormGroup;
  
  private subscriptions$ = new Subscription();

  constructor(
    private fb : FormBuilder,
    private notificationService : NotificationsService,
    private service : CompanyInfoService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      photo: [null],
      name: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5)
        ]
      }],
      phone: [null,{
        validators : [
          Validators.required
        ]
      }],
      country: [null, {
        validators: [
          Validators.required
        ]
      }],
      state: [null, {
        validators: [
          Validators.required
        ]
      }],
      city: [null, {
        validators: [
          Validators.required
        ]
      }],
      zip: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(5)
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
    this.getInfo();
  }

  @HostListener("unloaded")
  ngOnDestroy() {
    console.log('On destroy company info');
    this.subscriptions$.unsubscribe();
  }

  get name() {
    return this.form.get('name');
  }

  get phone() {
    return this.form.get('phone');
  }

  get country() { 
    return this.form.get('country');
  }

  get state() { 
    return this.form.get('state');
  }

  get city() {
    return this.form.get('city');
  }

  get zip() {
    return this.form.get('zip');
  }
  
  get line1() {
    return this.form.get('line1');
  }

  get line2() {
    return this.form.get('line2');
  }

  get photo() {
    return this.form.get('photo');
  }

  get noCacheUrl() : string{
    return `${this.photoSrc}?${this.timestamp}`;
  }
  
  get timestamp() {
    return new Date().getTime();
  }


  private getInfo() {
    this.loadingDetails = true;
    this.loadingError = false;
    this.subscriptions$.add(
      this.service.getInfo().subscribe({
        next: result => {
          console.log(result);
          this.loadingDetails = false;
          this.photoSrc = `${result.logoUri}?${this.timestamp}`;
          this.name.patchValue(result.name);
          this.phone.patchValue(result.phone);
          this.country.patchValue(result.country);
          this.state.patchValue(result.state);
          this.city.patchValue(result.city);
          this.zip.patchValue(result.zip);
          this.line1.patchValue(result.line1);
          if (result.line2 !== null) {
            this.line2.patchValue(result.line2);
          }
        },
        error: error => {
          this.loadingDetails = false;
          this.loadingError = true;
          console.log(error);
        }
      })
    );
  }

  onRetryClick() {
    this.getInfo();
  }

  onRemovePhotoClick() {
    this.photoSrc = undefined;
  }

  onFilesChange(event) {
    this.onFilesDropped(event.target.files);
  }

  onFilesDropped(files) {
    if (files && files.length) {
      this.photoFile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.photoFile);
      reader.onload = () => {
        this.photoSrc = reader.result as string;
      };
    }
  }

  private updateInfo() {
    this.updating = true;
    const request : UpdateCompanyInfo = {...this.form.value, photo: this.photoFile};
    this.subscriptions$.add(
      this.service.updateInfo(request).subscribe({
        next: () => {
          this.updating = false;
          this.notificationService.showNotification('done', 'Company Info updated successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.updating = false;
          console.log(error);
        }
      })
    );
  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAsTouched();
      return;
    }
    this.updateInfo();
  }

}

