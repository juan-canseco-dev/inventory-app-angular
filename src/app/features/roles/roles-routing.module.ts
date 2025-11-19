import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'app/core/guards/permission';
import { RolePermissions } from 'app/core/models/backend/permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    canActivateChild: [PermissionGuard],
    data: {permission: RolePermissions.Access}
  },
  {
    path: 'create',
    loadChildren: () => import('./create').then(m => m.CreateModule),
    canActivateChild: [PermissionGuard],
    data: {permission: RolePermissions.Create}
  },
  {
    path: 'details/:roleId',
    loadChildren: () => import('./details').then(m => m.DetailsModule),
    canActivateChild: [PermissionGuard],
    data: {permission: RolePermissions.Access}
  },
  {
    path: 'edit/:roleId',
    loadChildren: () => import('./edit').then(m => m.EditModule),
    canActivateChild: [PermissionGuard],
    data: {permission: RolePermissions.Edit}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
