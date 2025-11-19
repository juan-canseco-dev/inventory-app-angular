import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { PipesModule } from 'app/core/pipes';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeleteComponent } from './components/delete';
import { DetailsComponent } from './components/details';
import { EditComponent } from './components/edit';
import { ToggleActiveComponent } from './components/toggle-active';
import { CreateComponent } from './components/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    DeleteComponent,
    DetailsComponent,
    EditComponent,
    ToggleActiveComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ShimmerModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSortModule,
    PipesModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
