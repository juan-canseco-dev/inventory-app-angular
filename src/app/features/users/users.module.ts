import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { RolesResolver } from './resolvers/roles-resover';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  providers: [
    RolesResolver
  ]
})
export class UsersModule { }
