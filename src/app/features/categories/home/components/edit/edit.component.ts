import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResult } from 'app/core/models/frontend/dialog-result';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'app/core/services/categories';
import { EditCategoryRequest } from 'app/core/models/backend/categories';

export interface EditDialogData {
  categoryId: number;
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  private dialogResult : DialogResult<any> | undefined;

  loading: boolean = false;
  error: boolean = false;
  editing: boolean = false;
  parent : FormGroup;

  private subscriptions$ = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : EditDialogData,
    private categoryService : CategoriesService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.parent = this.fb.group({
      name: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }]
    });
    this.getCategoryDetails();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onSubmit() : void {
    if (!this.parent.valid) {
      return;
    }
    this.editCategory();
  }

  onCancelClick() {
    if (this.loading || this.editing) {
      this.subscriptions$.unsubscribe();
    }
    this.dialogResult = {message: '', status: 'close', result: undefined};
    this.dialogRef.close(this.dialogResult);
  }

  retry() {
    this.getCategoryDetails();
  }

  getCategoryDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.categoryService.getCategoryDetails(this.data.categoryId).subscribe({
        next: result =>  {
          this.loading = false;
          this.name.patchValue(result.name);
        },
        error: error => {
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  editCategory() {
    this.editing = true;
    const editRequest : EditCategoryRequest = {categoryId: this.data.categoryId, name: this.name.value}; 
    this.subscriptions$.add(
      this.categoryService.editCategory(editRequest).subscribe({
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

  get name() {
    return this.parent.get('name');
  }
}
