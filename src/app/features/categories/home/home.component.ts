import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category, GetCategoriesQueryParams } from 'app/core/models/backend/categories';
import { PagedList } from 'app/core/models/backend/shared';
import { CategoriesService } from 'app/core/services/categories';
import { PermissionsService } from 'app/core/services/permissions';
import { CategoryPermissions } from 'app/core/models/backend/permissions';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { DeleteComponent } from './components/delete';
import { ToggleActiveComponent } from './components/toggle-active';
import { CreateComponent } from './components/create';
import { DetailsComponent } from './components/details';
import { EditComponent } from './components/edit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pagedList!: PagedList<Category> | undefined;
  error: boolean = false;
  empty: boolean = false;
  loading: boolean = false;
  filterClicked : boolean = false;  

  hasCreatePermission : boolean;
  hasEditPermission : boolean;
  hasDeletePermission : boolean;

  itemsPerPage = [5, 10, 15, 20, 25, 50];

  params: GetCategoriesQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: '',
    sortOrder: '',
    name: '',
    active: null
  };

  private subscriptions$ = new Subscription();

  constructor(
    private categoryService : CategoriesService,
    private permissionsService : PermissionsService,
    private notificationService : NotificationsService,
    private dialog : MatDialog) { }

  ngOnInit(): void {
    this.getCategories();
    
    this.hasCreatePermission = this.permissionsService.hasPermission(CategoryPermissions.Create);
    this.hasEditPermission = this.permissionsService.hasPermission(CategoryPermissions.Edit);
    this.hasDeletePermission = this.permissionsService.hasPermission(CategoryPermissions.Delete);
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getCategories() {
    this.error = false;
    this.loading = true;
    const subscription$ = this.categoryService.getCategories(this.params).subscribe({
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
    this.getCategories();
  }

  onClearFiltersClick() {
    this.params.active = null;
    this.params.name = '';
    this.params.pageNumber = 1;
    this.params.pageSize = 10;
    this.getCategories();
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
    this.getCategories();
  }

  onFilterChange() {
    this.params.pageNumber = 1;
    this.getCategories();
  }

  onSortChange(sort : Sort) {
    this.params.pageNumber = 1;
    this.params.orderBy = sort.active;
    this.params.sortOrder = sort.direction;
    this.getCategories();
  }

  private reloadCategories() {
    this.params.pageNumber = 1;
    this.getCategories();
  }

  openDeleteDialog(category : Category) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {category: category},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadCategories();
        break;
        case 'success':
          this.reloadCategories();
          this.notificationService.showNotification('done', 'Category deleted successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadCategories();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }
  
  openToggleActiveDialog(category : Category) {
    const dialogRef = this.dialog.open(ToggleActiveComponent, {
      data: {category: category},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadCategories();
        break;
        case 'success':
          this.reloadCategories();
          this.notificationService.showNotification('done', 'Category Toggle successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadCategories();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateComponent, {
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadCategories();
        break;
        case 'success':
          this.reloadCategories();
          this.notificationService.showNotification('done', 'Category Created successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadCategories();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openDetailsDialog(category : Category) {
    const dialogRef = this.dialog.open(DetailsComponent, {
      data: {categoryId: category.id},
      disableClose: true
    });
  }

  openEditDialog(category : Category) {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {categoryId: category.id},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadCategories();
        break;
        case 'success':
          this.reloadCategories();
          this.notificationService.showNotification('done', 'Category Edited successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadCategories();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }



}
