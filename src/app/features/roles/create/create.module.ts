import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateRoutingModule } from './create-routing.module';
import { CreateComponent } from './create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { ComponentsModule } from '../components';
import { ShimmerModule } from '@sreyaj/ng-shimmer';

@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ComponentsModule,
    ShimmerModule
  ]
})
export class CreateModule { }
