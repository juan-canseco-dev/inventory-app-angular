import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'app/core/models/backend/categories';
import { CategoriesService } from 'app/core/services/categories';
import { Subscription } from 'rxjs';
import { DialogResult } from 'app/core/models/frontend/dialog-result';

export interface DeleteDialogData {
  category: Category;
}

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
    private categoriesService : CategoriesService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onDeleteClick() {
    this.loading = true;
    this.subscriptions$.add(
      this.categoriesService.deleteCategory(this.data.category.id).subscribe({
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
