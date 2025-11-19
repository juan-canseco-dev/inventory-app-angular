import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DialogResult } from 'app/core/models/frontend/dialog-result';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { switchMap, startWith } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriesService } from 'app/core/services/categories';
import { SuppliersService } from 'app/core/services/suppliers';
import { ProductsService } from 'app/core/services/products';
import { Supplier } from 'app/core/models/backend/suppliers';
import { Category } from 'app/core/models/backend/categories';
import { ProductDetails, UpdateProductRequest } from 'app/core/models/backend/products';

export interface EditDialogData {
  productId: number;
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  private dialogResult : DialogResult<any> | undefined;

  selectedSupplier: Supplier | null = null;
  filteredSuppliers$: Observable<Supplier[]>;

  selectedCategory: Category | null = null;
  filteredCategories$: Observable<Category[]>;

  loading: boolean = false;
  error: boolean = false;
  editing: boolean = false;
  parent : FormGroup;
  product: ProductDetails;

  private subscriptions$ = new Subscription();
  private readonly regex = /^\d+(\.\d{1,2})?$/;


  constructor(
    public dialogRef : MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : EditDialogData,
    private categoryService: CategoriesService,
    private supplierService: SuppliersService,
    private productService: ProductsService,
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

    this.getProduct();
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
    this.selectedCategory = null;
  }

  onClearSupplierClick() {
    this.selectedSupplier = null;
  }

  private patchValue() {
    this.name.patchValue(this.product.name);
    this.purchasePrice.patchValue(this.product.purchasePrice);
    this.salePrice.patchValue(this.product.salePrice);

    this.selectedSupplier = {
      id: this.product.supplier.supplierId,
      contactName: '',
      companyName: this.product.supplier.name, 
      contactPhone: '',
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
      active: false,
    };

    this.supplier.patchValue(this.selectedSupplier);

    this.selectedCategory = {
      id: this.product.category.categoryId,
      name: this.product.category.name,
      active: true,
      createdAt: null,
      createdBy: null,
      updatedAt: null,
      updatedBy: null,
    };

    this.category.patchValue(this.selectedCategory);
  }

  private getProduct() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.productService.getProductDetails(this.data.productId).subscribe({
        next: response => {
          this.loading = false;
          this.product = response;
          this.patchValue();
          console.log(this.product);
        },
        error: error => {
          if (error.status === 404) {
            // Exit Dialog and Test 
            return;
          }
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  private editProduct() {
    this.editing = true;
    const editRequest : UpdateProductRequest = {
      productId: this.data.productId,
      name: this.name.value,
      categoryId: this.category.value.id,
      supplierId: this.supplier.value.id,
      purchasePrice: this.purchasePrice.value,
      salePrice: this.salePrice.value
    };
    this.subscriptions$.add(
      this.productService.editProduct(editRequest).subscribe({
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

  retry() {
    this.getProduct();
  }

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    this.editProduct();
  }

  onCancelClick() {
    if (this.loading) {
      this.subscriptions$.unsubscribe();
    }
    this.dialogResult = {message: '', status: 'close', result: undefined};
    this.dialogRef.close(this.dialogResult);
  }

}
