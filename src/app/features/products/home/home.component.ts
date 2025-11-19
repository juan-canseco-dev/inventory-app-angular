import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagedList } from 'app/core/models/backend/shared';
import { PermissionsService } from 'app/core/services/permissions';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Category } from 'app/core/models/backend/categories';
import { Supplier } from 'app/core/models/backend/suppliers';
import { Product, GetProductsQueryParams} from 'app/core/models/backend/products';
import { ProductsService } from 'app/core/services/products';
import { CategoriesService } from 'app/core/services/categories';
import { SuppliersService } from 'app/core/services/suppliers';
import { ProductPermissions } from 'app/core/models/backend/permissions';
import { Sort } from '@angular/material/sort';
import { DeleteComponent } from './components/delete/delete.component';
import { ToggleActiveComponent } from './components/toggle-active/toggle-active.component';
import { CreateComponent } from './components/create';
import { EditComponent } from './components/edit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  searchCategoryControl = new FormControl('');
  filteredCategories$ : Observable<Category[]>;
  selectedCategory = '';

  searchSupplierControl = new FormControl('');
  filteredSuppliers$ : Observable<Supplier[]>;
  selectedSupplier = '';

  pagedList! : PagedList<Product> | undefined;
  empty : boolean = false;
  loading : boolean = false;
  error : boolean = false;
  filterClicked : boolean = false;  

  hasCreatePermission : boolean;
  hasEditPermission : boolean;
  hasDeletePermission : boolean;

  itemsPerPage = [5, 10, 15, 20, 25, 50];

  params : GetProductsQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: '',
    sortOrder: '',
    name: '',
    categoryId: null,
    supplierId: null,
    active: null
  };

  subscriptions$ : Subscription = new Subscription();

  constructor(
    private productService : ProductsService,
    private categoryService : CategoriesService,
    private supplierService : SuppliersService,
    private permissionsService : PermissionsService,
    private notificationService : NotificationsService,
    private dialog : MatDialog) { }

  ngOnInit(): void {
    this.getProducts();
    
    this.hasCreatePermission = this.permissionsService.hasPermission(ProductPermissions.Create);
    this.hasEditPermission = this.permissionsService.hasPermission(ProductPermissions.Edit);
    this.hasDeletePermission = this.permissionsService.hasPermission(ProductPermissions.Delete);

    this.filteredCategories$ = this.searchCategoryControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.categoryService.getAllCategories(value))
    );

    this.filteredSuppliers$ = this.searchSupplierControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.supplierService.getAllSuppliers(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getProducts() {
    this.error = false;
    this.loading = true;
    const subscription$ = this.productService.getProducts(this.params).subscribe({
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
    this.getProducts();
  }

  onClearFiltersClick() {
    this.selectedCategory = '';
    this.selectedSupplier = '';
    this.params.active = null;
    this.params.name = '';
    this.params.categoryId = null;
    this.params.supplierId = null;
    this.params.pageNumber = 1;
    this.params.pageSize = 10;
    this.getProducts();
  }

  onFilterClick() {
    if (this.filterClicked) {
      this.onClearFiltersClick();
    }
    this.filterClicked = !this.filterClicked;
  }

  displayCategoryFn(category : Category) : string {
    return category && category.name? category.name : '';
  }
  
  displaySupplierFn(supplier : Supplier) : string {
    return supplier && supplier.companyName? supplier.companyName : '';
  }

  onClearCategoryClick() {
    this.selectedCategory = '';
    this.params.categoryId = null;
    this.onFilterChange();
  }

  onClearSupplierClick() {
    this.selectedSupplier = '';
    this.params.supplierId = null;
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

  onCategorySelected(e) {
    const category = e.option.value;
    this.params.categoryId = category.id;
    this.onFilterChange();
  }

  onSupplierSelected(e) {
    const supplier = e.option.value;
    this.params.supplierId = supplier.id;
    this.onFilterChange(); 
  }

  onPageChange(event : number) {
    this.params.pageNumber = event;
    this.getProducts();
  }

  onFilterChange() {
    this.params.pageNumber = 1;
    this.getProducts();
  }

  private reloadProducts() {
    this.params.pageNumber = 1;
    this.getProducts();
  }

  onSortChange(sort : Sort) {
    this.params.pageNumber = 1;
    this.params.orderBy = sort.active;
    this.params.sortOrder = sort.direction;
    this.getProducts();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateComponent, {
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadProducts();
        break;
        case 'success':
          this.reloadProducts();
          this.notificationService.showNotification('done', 'Product Created successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadProducts();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openDeleteDialog(product : Product) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {product: product},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadProducts();
        break;
        case 'success':
          this.reloadProducts();
          this.notificationService.showNotification('done', 'Product deleted successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadProducts();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }
  
  openToggleActiveDialog(product : Product) {
    const dialogRef = this.dialog.open(ToggleActiveComponent, {
      data: {product: product},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadProducts();
        break;
        case 'success':
          this.reloadProducts();
          this.notificationService.showNotification('done', 'Product Toggle successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadProducts();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

  openEditDialog(product : Product) {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {productId: product.id},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      switch(result.status) {
        case 'close':
          this.reloadProducts();
        break;
        case 'success':
          this.reloadProducts();
          this.notificationService.showNotification('done', 'Category Edited successfully', 'top', 'center', 'success');
        break;
        case 'error':
          this.reloadProducts();
          this.notificationService.showNotification('error', result.message, 'bottom', 'center', 'danger');
        break;
      }
    });
  }

}
