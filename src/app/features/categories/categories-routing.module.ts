import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'app/core/guards/permission';
import { CategoryPermissions } from 'app/core/models/backend/permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    canActivateChild: [PermissionGuard],
    data: {permission: CategoryPermissions.Access}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
