import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule} from '@angular/forms';
import { PipesModule } from 'app/core/pipes';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { ComponentsModule } from '../components';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HomeRoutingModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTooltipModule,
    ShimmerModule,
    PipesModule,
    ComponentsModule
  ]
})
export class HomeModule { }
