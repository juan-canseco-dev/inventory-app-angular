import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UpdateUserInfoRequest, UserProfile } from 'app/core/models/backend/auth';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { AuthService } from 'app/core/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {

  showCurrentPassword : boolean = false;
  showNewPassword : boolean = false;
  loading : boolean = false;

  form !: FormGroup;

  profile : UserProfile;

  subscriptions$ = new Subscription();

  constructor(
    private authService : AuthService,
    private notificationService : NotificationsService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.profile = this.authService.getUserProfle();
    this.form = this.fb.group({
      fullname: [this.profile.fullname, {
        validators: [
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.required
        ]
      }],
      email : [this.profile.email, {
        validators: [
          Validators.email,
          Validators.maxLength(50),
          Validators.required
        ]
      }],
      currentPassword: [null, {
        validators: [
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.required
        ]
      }],
      newPassword: [null, {
        validators: [
          Validators.minLength(6),
          Validators.maxLength(30)
        ]
      }]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  get email() {
    return this.form.get('email');
  }
  
  get fullname() {
    return this.form.get('fullname');
  }
  
  get currentPassword() {
    return this.form.get('currentPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }
  
  toggleCurrentPassword() : void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() : void {
    this.showNewPassword = !this.showNewPassword;
  }

  private updateInfo() {
    this.loading = true;
    const request : UpdateUserInfoRequest = {...this.form.value};
    this.subscriptions$.add(
      this.authService.updateUserInfo(request).subscribe({
        next: () => {
          this.loading = false;
          this.notificationService.showNotification('done', 'User Info Updated successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.loading = false;
          console.log(error);
          if (error.status === 422 || error.status === 400) {
            this.notificationService.showNotification('error', error.error.Message, 'bottom', 'center', 'danger');
            return;
          }
          this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
        }
      })
    );
  }

  onSubmit() : void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.updateInfo();
  }
}
