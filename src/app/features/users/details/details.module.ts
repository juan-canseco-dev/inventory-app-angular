import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { ComponentsModule } from 'app/features/roles/components';

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetailsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ShimmerModule,
    ComponentsModule
  ]
})
export class DetailsModule { }
