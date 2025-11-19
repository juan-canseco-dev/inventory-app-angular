import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ComponentsModule } from '../components';

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetailsRoutingModule,
    ShimmerModule,
    MatButtonModule,
    MatInputModule,
    ComponentsModule
  ]
})
export class DetailsModule { }
