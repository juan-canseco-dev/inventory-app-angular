import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'app/core/pipes';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { CreateComponent } from './components/create/create.component';
import { DeleteComponent } from './components/delete/delete.component';
import { ToggleActiveComponent } from './components/toggle-active/toggle-active.component';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    DeleteComponent,
    ToggleActiveComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    NgxPaginationModule,
    ShimmerModule
  ]
})
export class HomeModule { }
