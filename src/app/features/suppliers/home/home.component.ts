import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierPermissions } from 'app/core/models/backend/permissions';
import { PagedList } from 'app/core/models/backend/shared';
import { Supplier } from 'app/core/models/backend/suppliers';
import { PermissionsService } from 'app/core/services/permissions';
import { GetSuppliersQueryParams, SuppliersService } from 'app/core/services/suppliers';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from './components/delete/delete.component';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { ToggleActiveComponent } from './components/toggle-active/toggle-active.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {


  pagedList! : PagedList<Supplier> | undefined;
  empty : boolean = false;
  loading : boolean = false;
  error : boolean = false;
  filterClicked : boolean = false;  

  hasCreatePermission : boolean;
  hasEditPermission : boolean;
  hasDeletePermission : boolean;

  itemsPerPage = [5, 10, 15, 20, 25, 50];

  params : GetSuppliersQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: '',
    sortOrder: '',
    contactName: '',
    companyName: '',
    active: null
  };

  subscriptions$ : Subscription = new Subscription();

  constructor(
    private suppliersService : SuppliersService,
    private permissionsService : PermissionsService,
    private notificationService : NotificationsService,
    private dialog : MatDialog) { }

  ngOnInit(): void {
    this.getSuppliers();
    
    this.hasCreatePermission = this.permissionsService.hasPermission(SupplierPermissions.Create);
    this.hasEditPermission = this.permissionsService.hasPermission(SupplierPermissions.Edit);
    this.hasDeletePermission = this.permissionsService.hasPermission(SupplierPermissions.Delete);
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  getSuppliers() {
    this.error = false;
    this.loading = true;
    const subscription$ = this.suppliersService.getSuppliers(this.params).subscribe({
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
    this.getSuppliers();
  }

  onClearFiltersClick() {
    this.params.active = null;
    this.params.contactName = '';
    this.params.companyName = '';
    this.params.pageNumber = 1;
    this.params.pageSize = 10;
    this.getSuppliers();
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

  onClearCompanyNameClick() {
    this.params.companyName = '';
    this.onFilterChange();
  }

  onClearContactNameClick() {
    this.params.contactName = '';
    this.onFilterChange();
  }

  onPageChange(event : number) {
    this.params.pageNumber = event;
    this.getSuppliers();
  }

  onFilterChange() {
    this.params.pageNumber = 1;
    this.getSuppliers();
  }

  openDeleteDialog(supplier : Supplier) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {supplier: supplier},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadSuppliers();
        break;
        case 'success':
          this.reloadSuppliers();
          this.notificationService.showNotification('done', 'Supplier deleted successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadSuppliers();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openToggleActiveDialog(supplier : Supplier) {
    const dialogRef = this.dialog.open(ToggleActiveComponent, {
      data: {supplier: supplier},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadSuppliers();
        break;
        case 'success':
          this.reloadSuppliers();
          this.notificationService.showNotification('done', 'Supplier Toggle successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadSuppliers();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  private reloadSuppliers() {
    this.params.pageNumber = 1;
    this.getSuppliers();
  }
  
  onSortChange(sort : Sort) {
    this.params.pageNumber = 1;
    this.params.orderBy = sort.active;
    this.params.sortOrder = sort.direction;
    this.getSuppliers();
  }

}
