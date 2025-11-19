import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'app/core/services/products';
import { Product } from 'app/core/models/backend/products';
import { DialogResult } from 'app/core/models/frontend/dialog-result';
import { Subscription } from 'rxjs';

export interface ToggleActiveDialogData {
  product: Product;
};

@Component({
  selector: 'app-toggle-active',
  templateUrl: './toggle-active.component.html',
  styleUrls: ['./toggle-active.component.scss']
})
export class ToggleActiveComponent implements OnInit, OnDestroy {

  private dialogResult : DialogResult<any> | undefined;

  loading : boolean = false;
  action : string;
  title : string;

  private subscriptions$ : Subscription = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<ToggleActiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data : ToggleActiveDialogData,
    private productService : ProductsService
  ) { }

  ngOnInit(): void {
    this.action = this.data.product.active? 'Disable' : 'Enable';
    this.title = `${this.action} Product Confirmation`;
  }
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onConfirmClick() {
    this.loading = true;
    this.subscriptions$.add(
      this.productService.toggleActive(this.data.product.id).subscribe({
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

  onCancelClick() {
    this.dialogResult = {message: '', status: 'close', result: undefined};
    this.dialogRef.close(this.dialogResult);
  }

}
