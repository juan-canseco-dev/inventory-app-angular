import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsComponent } from './permissions/permissions.component';
import { CheckboxListModule } from 'app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteComponent } from './delete/delete.component';
import { EnableComponent } from './enable/enable.component';

@NgModule({
  declarations: [
    PermissionsComponent,
    DeleteComponent,
    EnableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxListModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    PermissionsComponent,
    DeleteComponent,
    EnableComponent
  ]
})
export class ComponentsModule { }
