import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivateChild {
  constructor(private authService : AuthService, private router : Router) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/");
      return false;
    }  
    return true;
  } 
}
