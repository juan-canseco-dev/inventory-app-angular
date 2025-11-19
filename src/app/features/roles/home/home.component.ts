import { Component, OnInit, OnDestroy } from '@angular/core';
import { Role } from 'app/core/models/backend/roles';
import { PagedList } from 'app/core/models/backend/shared';
import { RolesService, GetRolesQueryParams} from 'app/core/services/roles';
import { RolePermissions } from 'app/core/models/backend/permissions';
import { PermissionsService } from 'app/core/services/permissions';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { DeleteComponent } from '../components/delete/delete.component';
import { EnableComponent } from '../components/enable/enable.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pagedList! : PagedList<Role>;
  empty : boolean = false;
  loading : boolean = false;
  error : boolean = false;
  filterClicked : boolean = false;  

  hasCreatePermission : boolean;
  hasEditPermission : boolean;
  hasDeletePermission : boolean;

  itemsPerPage = [5, 10, 15, 20, 25, 50];


  params :  GetRolesQueryParams = {
     pageNumber: 1,
     pageSize: 10, 
     orderBy: '', 
     sortOrder: '', 
     name: '',
     active: null
    }; 

  private subscriptions$ = new Subscription();

  constructor(
    private roleService : RolesService,
    private permissionsService : PermissionsService,
    private notificationService : NotificationsService,
    private dialog : MatDialog) { }

    ngOnInit(): void {
    this.getRoles();
    this.hasCreatePermission = this.permissionsService.hasPermission(RolePermissions.Create);
    this.hasDeletePermission = this.permissionsService.hasPermission(RolePermissions.Delete);
    this.hasEditPermission = this.permissionsService.hasPermission(RolePermissions.Edit);
  }

  ngOnDestroy() : void {
    this.subscriptions$.unsubscribe();
  }

  getRoles() {
    this.error = false;
    this.loading = true;
    this.subscriptions$.add(
      this.roleService.getRoles(this.params).subscribe({
        next: pagedList => {
          this.pagedList = pagedList;
          this.loading = false;
          this.empty = pagedList.items && pagedList.items.length === 0;
        },
        error: error => {
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  retry() {
    this.getRoles();
  }

  onClearFiltersClick() {
    this.params.active = null;
    this.params.name = '';
    this.params.pageNumber = 1;
    this.params.pageSize = 10;
    this.getRoles();
  }

  onFilterClick() {
    if (this.filterClicked) {
      this.onClearFiltersClick();
    }
    this.filterClicked = !this.filterClicked;
  }

  onClearStatusClick() {
    this.params.active = null;
    this.onFilterChange();
  }

  onClearNameClick() {
    this.params.name = '';
    this.onFilterChange();
  }

  onPageChange(event : number) {
    this.params.pageNumber = event;
    this.getRoles();
  }

  onFilterChange() {
    this.params.pageNumber = 1;
    this.getRoles();
  }

  private reloadRoles() {
    this.params.pageNumber = 1;
    this.getRoles();
  }

  onSortChange(sort : Sort) {
    this.params.pageNumber = 1;
    this.params.orderBy = sort.active;
    this.params.sortOrder = sort.direction;
    this.getRoles();
  }

  openDeleteDialog(role : Role) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {role: role},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'cancelled': 
        this.reloadRoles();
        break;
        case 'success':
          this.reloadRoles();
          this.notificationService.showNotification('done', result.message, 'top', 'center', 'success');
        break;
        case 'error':
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openEnableDialog(role : Role, enable: boolean) {
    const dialogRef = this.dialog.open(EnableComponent, {
      data: {role: role, enable: enable},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'cancelled': 
        this.reloadRoles();
        break;
        case 'success':
          this.reloadRoles();
          this.notificationService.showNotification('done', result.message, 'top', 'center', 'success');
        break;
        case 'error':
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

}
