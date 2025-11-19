import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'app/core/models/backend/categories';
import { CreateProductRequest } from 'app/core/models/backend/products';
import { Supplier } from 'app/core/models/backend/suppliers';
import { DialogResult } from 'app/core/models/frontend/dialog-result';
import { CategoriesService } from 'app/core/services/categories';
import { ProductsService } from 'app/core/services/products';
import { SuppliersService } from 'app/core/services/suppliers';
import { Observable, Subscription, startWith, switchMap } from 'rxjs';

export interface CreateDialogData {};

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  parent : FormGroup;
  private dialogResult : DialogResult<any> | undefined;
  loading : boolean = false;

  selectedSupplier: string = '';
  filteredSuppliers$: Observable<Supplier[]>;

  selectedCategory: string = '';
  filteredCategories$: Observable<Category[]>;

  private subscriptions$ = new Subscription();
  private readonly regex = /^\d+(\.\d{1,2})?$/;

  constructor(
    public dialogRef : MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data : CreateDialogData,
    private supplierService : SuppliersService,
    private categoryService : CategoriesService,
    private productService : ProductsService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.parent = this.fb.group({
      name: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }],
      supplier: [null, {
        validators: [
          Validators.required
        ]
      }],
      category: [null, {
        validators: [
          Validators.required
        ]
      }],
      purchasePrice: ['', {
        validators: [
          Validators.required,
          this.decimalNumberValidator()
        ],
        updateOn: 'change'
      }],
      salePrice: ['', {
        validators: [
          Validators.required,
          this.decimalNumberValidator()
        ],
        updateOn: 'change'
      }]
    });

    this.filteredCategories$ = this.category.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.categoryService.getAllCategories(value))
    );

    this.filteredSuppliers$ = this.supplier.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.supplierService.getAllSuppliers(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  decimalNumberValidator() : ValidatorFn {
    return (control : FormControl): {[key : string] : boolean} | null => {
      const value = control.value;
      if (!value.length) {
        return null;
      }
      if (!this.regex.test(value)) {
        return {invalidNumberFormat:true};
      }
      return null;
    }
  }

  displayCategoryFn(category : Category) : string {
    return category && category.name? category.name : '';
  }
  
  displaySupplierFn(supplier : Supplier) : string {
    return supplier && supplier.companyName? supplier.companyName : '';
  }

  get name() {
    return this.parent.get('name');
  }

  get supplier() {
    return this.parent.get('supplier');
  }

  get category() {
    return this.parent.get('category');
  }
  get purchasePrice() {
    return this.parent.get('purchasePrice');
  }
  get salePrice() {
    return this.parent.get('salePrice');
  }
  
  onClearCategoryClick() {
    this.selectedCategory = '';
  }

  onClearSupplierClick() {
    this.selectedSupplier = '';
  }

  private createProduct() {
    this.loading = true;
    const request : CreateProductRequest = {
      name: this.name.value,
      categoryId: this.category.value.id,
      supplierId: this.supplier.value.id,
      purchasePrice: this.purchasePrice.value,
      salePrice: this.salePrice.value
    };
    this.subscriptions$.add(
      this.productService.createProduct(request).subscribe({
        next: () => {
          this.dialogResult = {message: '', status: 'success', result: undefined};
          this.dialogRef.close(this.dialogResult);
        },
        error: error => {
          let message = '';
          if (error.status === 422 || error.status === 400) {
            message = error.error.Message;
          }
          else {
            message = 'Internal Server Error';
          }
          this.dialogResult = {message: message, status: 'error', result: undefined};
          this.dialogRef.close(this.dialogResult);
        }
      })
    );
  }

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    this.createProduct();
  }

  onCancelClick() {
    if (this.loading) {
      this.subscriptions$.unsubscribe();
    }
    this.dialogResult = {message: '', status: 'close', result: undefined};
    this.dialogRef.close(this.dialogResult);
  }

}
