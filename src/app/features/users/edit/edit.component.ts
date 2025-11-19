import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute, Params, RouterConfigOptions } from '@angular/router';
import { Role } from 'app/core/models/backend/roles';
import { RolesService } from 'app/core/services/roles';
import { UsersService } from 'app/core/services/users';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';
import { EditUserRequest, UserDetails } from 'app/core/models/backend/users';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  selectedRole: Role | null = null;
  filteredRoles$ : Observable<Role[]>;

  form !: FormGroup;
  loading : boolean = false;
  detailsError : boolean = false;

  private userId : string = '';
  userDetails !: UserDetails;

  isEditing : boolean = false;

  private subscriptions$ : Subscription = new Subscription();

  constructor(
    private roleService : RolesService,
    private userService : UsersService,
    private notificationService : NotificationsService,
    private fb : FormBuilder,
    private router : ActivatedRoute, 
    private navRouter : Router) { }

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
      }]
    });
    
    this.filteredRoles$ = this.role.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.roleService.getAllRoles(value, null))
    );

    this.router.params.subscribe((params : Params) => {
      this.userId = params['userId'];
      this.getUserDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  displayFn(role : Role) : string {
    return role && role.name? role.name : '';
  }

  clearAutocomplete() {
    this.selectedRole = null;
  }

  retryDetails() {
    this.getUserDetails();
  }
  
  private getUserDetails() {
    this.loading = true;
    this.detailsError = false;
    const subscription$ = this.userService.getUserDetails(this.userId).subscribe({
      next: response => {
        this.loading = false;
        this.userDetails = response;
        this.setValues();
      },
      error: error => {
        if (error.status === 404) {
          this.navRouter.navigateByUrl('/static/not-found');
          return;
        }
        this.loading = false;
        this.detailsError = true;
        console.log(error);
      }
    });
    this.subscriptions$.add(subscription$);
  }

  private setValues() {
    this.email.patchValue(this.userDetails.email);
    this.fullname.patchValue(this.userDetails.fullname);
    const role : Role = {
      id: this.userDetails.role.id,
      name: this.userDetails.role.name,
      active: this.userDetails.role.active
    };
    this.selectedRole = role;
    this.role.patchValue(role);
  }

  private edit(request : EditUserRequest) : void {
    this.isEditing = true;
    const subscription$ =  this.userService.editUser(request).subscribe({
      next:() => {
        this.navRouter.navigateByUrl('users');
        this.notificationService.showNotification('done', 'User created successfully', 'top', 'center', 'success');
      },
      error: error => {
        console.log(error);
        this.isEditing = false;
        if (error.status === 422 || error.status === 400) {
          this.notificationService.showNotification('error', error.error.Message, 'bottom', 'center', 'danger');
          return;
        }
        this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
      }
    });
    this.subscriptions$.add(subscription$); 
  }

  get email() {
    return this.form.get('email');
  }
  
  get fullname() {
    return this.form.get('fullname');
  }
  
  get role() {
    return this.form.get('role');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const request : EditUserRequest = {
      userId : this.userId,
      roleId: this.role.value.id,
      fullname: this.form.value.fullname
    };
    console.log(request);
    this.edit(request);
  }
}
