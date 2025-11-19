import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'app/core/pipes';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule } from '@angular/material/sort';
import { DeleteComponent } from './components/delete/delete.component';
import { ToggleActiveComponent } from './components/toggle-active/toggle-active.component';


@NgModule({
  declarations: [
    HomeComponent,
    DeleteComponent,
    ToggleActiveComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    PipesModule,
    ShimmerModule,
    NgxPaginationModule,
    MatSortModule,
    MatDialogModule
  ]
})
export class HomeModule { }
