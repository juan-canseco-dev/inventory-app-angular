import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { EditRoleRequest, RoleDetails, EditModuleWithPermissionsRequest } from 'app/core/models/backend/roles';
import { RolesService } from 'app/core/services/roles';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  detailsForm : FormGroup;
  private roleId : string;
  private roleDetails : RoleDetails;
  loading : boolean = false;
  isEditing: boolean = false;
  error : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private roleService : RolesService,
    private router : Router,
    private route : ActivatedRoute,
    private fb : FormBuilder,
    private notificationService: NotificationsService,) { }

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
    this.route.params.subscribe((param : Params) => {
      this.roleId = param['roleId'];
      this.getRoleDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private getRoleDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.roleService.getRoleDetails(this.roleId).subscribe({
        next: response => {
          this.loading = false;
          this.roleDetails = response;
          this.setValues();
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

  private setValues() {
    this.name.patchValue(this.roleDetails.name);
    this.description.patchValue(this.roleDetails.description);
  }


  private mapModuleFormToRequest(module): EditModuleWithPermissionsRequest {
    return {
      id: module.moduleId,
      permissionsIds: module.permissions
    };
  }
  private mapModulesFormToRequest(): EditModuleWithPermissionsRequest[] {

    const modules = this.detailsForm.value.modules;
    return modules
      .filter(m => m.permissions !== null && m.permissions.length > 0)
      .map(m => this.mapModuleFormToRequest(m));
  };


  private edit() {
    this.isEditing = true;

    const request : EditRoleRequest = {
      roleId : this.roleId,
      name: this.detailsForm.value.name,
      description: this.detailsForm.value.description,
      modules: this.mapModulesFormToRequest()
    };

    this.subscriptions$.add(
      this.roleService.editRole(request).subscribe({
        next: () => {
          this.router.navigateByUrl('roles');
          this.notificationService.showNotification('done', 'Role edited successfully', 'top', 'center', 'success');
        },
        error: error => {
          this.isEditing = false;
          if (error.status === 422 || error.status === 400) {
            this.notificationService.showNotification('error', error.error.Message, 'bottom', 'center', 'danger');
            return;
          }
          this.notificationService.showNotification('error', 'Server Error', 'bottom', 'center', 'danger');
          console.log(error);
        }
      })
    )
  }

  onSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) {
      return;
    }
    this.edit();
  }

  retry() {
    this.getRoleDetails();
  }

  get name() {
    return this.detailsForm.get('name');
  }

  get description() {
    return this.detailsForm.get('description');
  }

}
