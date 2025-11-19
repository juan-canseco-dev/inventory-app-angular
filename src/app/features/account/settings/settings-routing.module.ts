import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: { title: 'Settings'},
    children: [
      {
        path: 'account-settings',
        loadChildren: () => import('./pages/account-settings').then(m => m.AccountSettingsModule)
      },
      {
        path: 'company-info',
        loadChildren: () => import('./pages/company-info').then(m => m.CompanyInfoModule)
      },
      {
        path: '',
        redirectTo: 'account-settings'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
