import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './delete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EnableComponent } from './enable/enable.component';

@NgModule({
  declarations: [
    DeleteComponent,
    EnableComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    DeleteComponent,
    EnableComponent
  ]
})
export class ComponentsModule { }
