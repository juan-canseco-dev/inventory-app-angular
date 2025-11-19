import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from '../components';
import { ShimmerModule } from '@sreyaj/ng-shimmer';

@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditRoutingModule,
    ShimmerModule,
    MatInputModule,
    MatButtonModule,
    ComponentsModule
  ]
})
export class EditModule { }
