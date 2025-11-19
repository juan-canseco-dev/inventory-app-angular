import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Role } from 'app/core/models/backend/roles';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'app/core/services/roles';
import { Subscription } from 'rxjs';

export interface DeleteDialogData {
  role : Role
};

export interface DeleteDialogStatus {
  status: 'default' | 'closed' | 'loading' | 'error' | 'success' | 'cancelled';
  message : string;
};

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit, OnDestroy {
  
  dialogStatus : DeleteDialogStatus = {status : 'default', message: ''};
  delete$ : Subscription = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data : DeleteDialogData,
    private roleService : RolesService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.delete$.unsubscribe();
  }

  onDeleteClick() {
    this.dialogStatus = { status: 'loading', message: ''};
    const subscription$ = this.roleService
    .deleteRole(this.data.role.id)
    .subscribe({
      next: () => {
        this.dialogStatus = { status: 'success', message: 'Role deleted successfully' };
        this.dialogRef.close(this.dialogStatus);
      },
      error: error => {
        let message = '';
        if (error.status === 422 || error.status === 400) {
          message = error.error.Message;
        }
        else {
          message = 'Internal Server Error';
        }
        this.dialogStatus = { status: 'error', message: message };
        this.dialogRef.close(this.dialogStatus);
      }
    });
    
    this.delete$.add(subscription$);
  }

  onCloseClick() {
    this.dialogRef.close({ status: 'closed', message: ''});
  }

  onCancelClick() {
    this.delete$.unsubscribe();
    this.dialogRef.close({status: 'cancelled', message: ''});
  }

}
