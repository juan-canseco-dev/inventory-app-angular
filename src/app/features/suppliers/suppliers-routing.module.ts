import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'app/core/guards/permission';
import { SupplierPermissions } from 'app/core/models/backend/permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    canActivateChild: [PermissionGuard],
    data: {permission: SupplierPermissions.Access}
  },
  {
    path: 'create',
    loadChildren: () => import('./create').then(m => m.CreateModule),
    canActivateChild: [PermissionGuard],
    data: {permission: SupplierPermissions.Create}
  },
  {
    path: 'details/:supplierId',
    loadChildren: () => import('./details').then(m => m.DetailsModule),
    canActivateChild: [PermissionGuard],
    data: {permission: SupplierPermissions.Access}
  },
  {
    path: 'edit/:supplierId',
    loadChildren: () => import('./edit').then(m => m.EditModule),
    canActivateChild: [PermissionGuard],
    data: {permission: SupplierPermissions.Edit}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
