import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'app/core/guards/permission';
import { UserPermissions } from 'app/core/models/backend/permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home').then(m => m.HomeModule),
    canActivateChild: [PermissionGuard],
    data: {permission: UserPermissions.Access}
  },
  {
    path: 'details/:userId',
    loadChildren: () => import('./details').then(m => m.DetailsModule),
    canActivateChild: [PermissionGuard],
    data: {permission: UserPermissions.Access}
  },
  {
    path: 'edit/:userId',
    loadChildren: () => import('./edit').then(m => m.EditModule),
    canActivateChild: [PermissionGuard],
    data: {permission: UserPermissions.Edit}
  },
  {
    path: 'create',
    loadChildren: () => import('./create').then(m => m.CreateModule),
    canActivateChild: [PermissionGuard],
    data: {permission : UserPermissions.Create}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
