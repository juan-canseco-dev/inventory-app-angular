import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '../../services/permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivateChild {
  constructor(private permissionService : PermissionsService, private router : Router) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    var permission = childRoute.data.permission;
    if(!this.permissionService.hasPermission(permission)) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }
}
