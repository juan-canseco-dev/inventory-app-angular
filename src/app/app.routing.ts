import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './features/main';
import { NotLoggedInGuard } from './core/guards/not-logged-in';
import { AuthGuard } from './core/guards/auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./features/main').then(m => m.AdminLayoutModule),
      canActivateChild: [AuthGuard]
    }]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/').then(m => m.AuthModule),
    canActivateChild: [NotLoggedInGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
