import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { User } from 'app/core/models/backend/users';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'app/core/services/users';

export interface EnableDialogData {
  user : User;
  enable : boolean;
};

export interface EnableDialogStatus {
  status: 'default' | 'closed' | 'loading' | 'error' | 'success' | 'cancelled';
  message: string;
};

@Component({
  selector: 'app-enable',
  templateUrl: './enable.component.html',
  styleUrls: ['./enable.component.scss']
})
export class EnableComponent implements OnInit, OnDestroy {
  
  dialogStatus : EnableDialogStatus = { status : 'default', message: ''};
  enable$ : Subscription = new Subscription();

  action : string;
  loadingAction : string;
  title : string;
  loadingTitle : string;

  constructor(
    public dialogRef : MatDialogRef<EnableComponent>,
    @Inject(MAT_DIALOG_DATA) public data : EnableDialogData,
    private userService : UsersService
  ) { }

  ngOnInit(): void {
    this.action = this.data.enable? 'Disable' : 'Enable';
    this.loadingAction = this.data.enable? 'Disabling' : 'Enabling';
    this.title = `${this.action} User Confirmation`;
    this.loadingTitle = `${this.loadingAction} User`;
  }
  
  ngOnDestroy() : void {
    this.enable$.unsubscribe();
  }

  onConfirmClick() {
    this.dialogStatus = { status: 'loading', message: ''};
    const subscription$ = this.userService
    .enableUser(this.data.user.id, this.data.enable)
    .subscribe({
      next: () => {
        let action = this.data.enable? 'disabled' : 'enabled';
        this.dialogStatus = { status: 'success', message: `User ${action} successfully` };
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
    this.enable$.add(subscription$);
  }

  onCloseClick() {
    this.dialogRef.close({ status: 'closed', message: ''});
  }

  onCancelClick() {
    this.enable$.unsubscribe();
    this.dialogRef.close({status: 'cancelled', message: ''});
  }
}
