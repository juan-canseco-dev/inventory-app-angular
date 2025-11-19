import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder : FormBuilder, 
              private router : Router,
              private authService : AuthService,
              private notificationService : NotificationsService) { }

  form! : FormGroup;
  loading : boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      }],
      password: [null, {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ]
      }]
    })
  }
    
  onSubmit() : void {
    
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.authService.login({email: this.email.value, password : this.password.value})
    .subscribe({
      next: response => {
        this.router.navigateByUrl('/');
        let welcomeMessage = `Welcome ${response.fullname}`;
        this.notificationService.showNotification('done', welcomeMessage, 'bottom', 'center', 'success')
      },
      error: err =>  {
        this.loading = false;
        console.log(err);
        if (err.status === 400 || err.status == 422) {
          this.notificationService.showNotification('error', 'Invalid Credentials', 'bottom', 'center', 'danger');
          return;
        }
        this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
      }
    });
  }

  get email() {return this.form.get('email');}
  get password()  {return this.form.get('password')};
}
