import { Component, OnInit, OnDestroy} from '@angular/core';
import { UsersService, GetUsersQueryParams} from 'app/core/services/users';
import { PagedList } from 'app/core/models/backend/shared';
import { User } from 'app/core/models/backend/users';
import { Role } from 'app/core/models/backend/roles';
import { PermissionsService } from 'app/core/services/permissions';
import { UserPermissions } from 'app/core/models/backend/permissions';
import { Sort } from '@angular/material/sort';
import { DeleteComponent } from '../components/delete/delete.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';
import { EnableComponent } from '../components/enable';
import { FormControl } from '@angular/forms';
import { RolesService } from 'app/core/services/roles';

export interface UserState {
  name : string;
  active : boolean | null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  searchRoleControl = new FormControl('');
  filteredRoles$ : Observable<Role[]>;
  selectedRole : string = '';

  pagedList! : PagedList<User> | undefined;
  empty : boolean = false;
  loading : boolean = false;
  error : boolean = false;
  filterClicked : boolean = false;  

  hasCreatePermission : boolean;
  hasEditPermission : boolean;
  hasDeletePermission : boolean;

  itemsPerPage = [5, 10, 15, 20, 25, 50];

  params : GetUsersQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: '',
    sortOrder: '',
    name: '',
    roleId: '',
    active: null
  };

  subscriptions$ : Subscription = new Subscription();

  constructor(
    private userService : UsersService, 
    private roleService : RolesService,
    private permissionsService : PermissionsService,
    private notificationService : NotificationsService,
    private dialog : MatDialog) { }

  ngOnInit(): void {
    
    this.getUsers();
    
    this.hasCreatePermission = this.permissionsService.hasPermission(UserPermissions.Create);
    this.hasEditPermission = this.permissionsService.hasPermission(UserPermissions.Edit);
    this.hasDeletePermission = this.permissionsService.hasPermission(UserPermissions.Delete);

    this.filteredRoles$ = this.searchRoleControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.roleService.getAllRoles(value, null))
    );

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
  
  getUsers() {
    this.error = false;
    this.loading = true;
    const subscription$ = this.userService.getUsers(this.params).subscribe({
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
    });
    this.subscriptions$.add(subscription$);
  }

  retry() {
    this.getUsers();
  }

  onClearFiltersClick() {
    this.selectedRole = '';
    this.params.active = null;
    this.params.name = '';
    this.params.roleId = '';
    this.params.pageNumber = 1;
    this.params.pageSize = 10;
    this.getUsers();
  }

  onFilterClick() {
    if (this.filterClicked) {
      this.onClearFiltersClick();
    }
    this.filterClicked = !this.filterClicked;
  }

  displayFn(role : Role) : string {
    return role && role.name? role.name : '';
  }
  
  onClearRoleClick() {
    this.selectedRole = '';
    this.params.roleId = '';
    this.onFilterChange();
  }

  onClearStatusClick() {
    this.params.active = null;
    this.onFilterChange();
  }

  onClearNameClick() {
    this.params.name = '';
    this.onFilterChange();
  }

  onRoleSelected(e) {
    const role = e.option.value;
    this.params.roleId = role.id;
    this.onFilterChange();
  }

  onPageChange(event : number) {
    this.params.pageNumber = event;
    this.getUsers();
  }

  onFilterChange() {
    this.params.pageNumber = 1;
    this.getUsers();
  }

  private reloadUsers() {
    this.params.pageNumber = 1;
    this.getUsers();
  }

  openDeleteDialog(user : User) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {user: user},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'cancelled': 
        this.reloadUsers();
        break;
        case 'success':
          this.reloadUsers();
          this.notificationService.showNotification('done', result.message, 'top', 'center', 'success');
        break;
        case 'error':
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }
  
  openEnableDialog(user : User, enable: boolean) {
    const dialogRef = this.dialog.open(EnableComponent, {
      data: {user: user, enable: enable},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'cancelled': 
        this.reloadUsers();
        break;
        case 'success':
          this.reloadUsers();
          this.notificationService.showNotification('done', result.message, 'top', 'center', 'success');
        break;
        case 'error':
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  onSortChange(sort : Sort) {
    this.params.pageNumber = 1;
    this.params.orderBy = sort.active;
    this.params.sortOrder = sort.direction;
    this.getUsers();
  }
}
