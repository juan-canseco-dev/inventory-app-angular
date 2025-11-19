import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'app/core/models/backend/roles';
import { CreateUserRequest } from 'app/core/models/backend/users';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { RolesService } from 'app/core/services/roles';
import { UsersService } from 'app/core/services/users/users.service';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  selectedRole: string = '';
  showPassword: boolean = false;
  filteredRoles$ : Observable<Role[]>;

  form !: FormGroup
  loading : boolean = false;

  private subscriptions$ : Subscription = new Subscription();

  constructor(
    private roleService : RolesService,
    private userService : UsersService,
    private notificationService : NotificationsService,
    private fb : FormBuilder, 
    private router : Router) { }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      fullname: [null, {
        validators: [
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.required
        ]
      }],
      role: [null, {
        validators: [
          Validators.required
        ]
      }],
      email : [null, {
        validators: [
          Validators.email,
          Validators.maxLength(50),
          Validators.required
        ]
      }],
      password: [null, {
        validators: [
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.required
        ]
      }]
    });
    
    this.filteredRoles$ = this.role.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.roleService.getAllRoles(value, null))
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  displayFn(role : Role) : string {
    return role && role.name? role.name : '';
  }

  clearAutocomplete() {
    this.selectedRole = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.form.get('email');
  }
  
  get fullname() {
    return this.form.get('fullname');
  }
  
  get password() {
    return this.form.get('password');
  }
  
  get role() {
    return this.form.get('role');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const request : CreateUserRequest = {...this.form.value, roleId: this.form.value.role.id}; 
    
    const subscription$ = this.userService
    .createUser(request)
    .subscribe({
      next: () => {
        this.router.navigateByUrl('users');
        this.notificationService.showNotification('done', 'User created successfully', 'top', 'center', 'success');
      },
      error: error => {
        this.loading = false;
        if (error.status === 422 || error.status === 400) {
          this.notificationService.showNotification('error', error.error.Message, 'bottom', 'center', 'danger');
          return;
        }
        this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
      }
    });
    this.subscriptions$.add(subscription$);
  }
  
}
