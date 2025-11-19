import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'app/core/guards/permission';
import { ProductPermissions } from 'app/core/models/backend/permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    canActivateChild: [PermissionGuard],
    data: { permission: ProductPermissions.Access}
  },
  {
    path:'details/:productId',
    loadChildren: () => import('./details').then(m => m.DetailsModule),
    canActivateChild: [PermissionGuard],
    data: { permission: ProductPermissions.Access}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
