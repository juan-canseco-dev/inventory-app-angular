import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Supplier } from 'app/core/models/backend/suppliers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuppliersService } from 'app/core/services/suppliers';
import { Subscription } from 'rxjs';
import { DialogResult } from 'app/core/models/frontend/dialog-result';

export interface DeleteDialogData {
  supplier : Supplier
};

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit, OnDestroy {
  
  private resultStatus : DialogResult<any> | undefined;

  loading : boolean = false;
  private subscriptions$ = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data : DeleteDialogData,
    private suppliersService : SuppliersService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onDeleteClick() {
    this.loading = true;
    this.subscriptions$.add(
      this.suppliersService.deleteSupplier(this.data.supplier.id).subscribe({
        next:() => {
          this.resultStatus = {message: '', status:'success', result:undefined};
          this.dialogRef.close(this.resultStatus);
        },
        error: error => {
          let message = '';
          if (error.status === 422 || error.status === 400) {
            message = error.error.Message;
          }
          else {
            message = 'Internal Server Error';
          }
          this.resultStatus = {message: message, status:'error', result:undefined};
          this.dialogRef.close(this.resultStatus);
        }
      })
    );
  }

  onCancelClick() {
    this.resultStatus = {message: '', status:'close', result:undefined};
    this.dialogRef.close(this.resultStatus);
  }
}
