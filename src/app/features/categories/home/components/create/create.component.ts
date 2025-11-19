import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from 'app/core/models/frontend/dialog-result';
import { CategoriesService } from 'app/core/services/categories';
import { Subscription } from 'rxjs';

export interface CreateDialogData {

};

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  parent : FormGroup;
  private dialogResult : DialogResult<any> | undefined;
  loading : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data : CreateDialogData,
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
    })
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    this.createCategory();
  }


  createCategory() {
    this.loading = true;
    this.subscriptions$.add(
      this.categoryService.createCategory({...this.parent.value}).subscribe({
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
    if (this.loading) {
      this.subscriptions$.unsubscribe();
    }
    this.dialogResult = {message: '', status: 'close', result: undefined};
    this.dialogRef.close(this.dialogResult);
  }
  
  get name() {
    return this.parent.get('name');
  }
}
