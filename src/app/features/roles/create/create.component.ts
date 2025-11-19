import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ModulesService } from 'app/core/services/modules/modules.service';
import { ModuleWithPermissions } from '../components/permissions/permissions.component';
import { Subscription } from 'rxjs';
import { RolesService } from 'app/core/services/roles';
import { CreateRoleRequest, CreateModuleWithPermissionsRequest } from 'app/core/models/backend/roles';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  loadingPermissions: boolean = false;
  loadingPermissionsError: boolean = false;
  permissions: ModuleWithPermissions[];

  isCreating: boolean = false;

  detailsForm !: FormGroup;
  subscriptions$ = new Subscription();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationsService,
    private router: Router,
    private roleService: RolesService,
    private moduleService: ModulesService) { }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      name: [null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      }],
      description: [null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]
      }]
    });

    this.getModules();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private getModules() {
    this.loadingPermissionsError = false;
    this.loadingPermissions = true;
    this.subscriptions$.add(
      this.moduleService.getModules().subscribe({
        next: result => {
          this.permissions = result;
          this.loadingPermissions = false;
        },
        error: error => {
          this.loadingPermissions = false;
          this.loadingPermissionsError = true;
          console.log(error);
        }
      })
    );
  }

  private mapModuleFormToRequest(module): CreateModuleWithPermissionsRequest {
    return {
      id: module.moduleId,
      permissionsIds: module.permissions
    };
  }
  private mapModulesFormToRequest(): CreateModuleWithPermissionsRequest[] {

    const modules = this.detailsForm.value.modules;
    return modules
      .filter(m => m.permissions !== null && m.permissions.length > 0)
      .map(m => this.mapModuleFormToRequest(m));
  };


  private create(): void {
    
    this.isCreating = true;

    const request: CreateRoleRequest = {
      name: this.detailsForm.value.name,
      description: this.detailsForm.value.description,
      modules: this.mapModulesFormToRequest()
    };

    this.subscriptions$.add(
      this.roleService.createRole(request).subscribe({
        next: () => {
          this.router.navigateByUrl('roles');
          this.notificationService.showNotification('done', 'Role created successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.isCreating = false;
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

  retry() {
    this.getModules();
  }

  onSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) {
      return;
    }
    this.create();
  }
  
  get name() {
    return this.detailsForm.get('name');
  }

  get description() {
    return this.detailsForm.get('description');
  }

}
