import { Injectable } from '@angular/core';
import { MenuItem } from 'app/core/models/frontend/menu-item';
import { UserPermissions, RolePermissions, ProductPermissions, CategoryPermissions, SupplierPermissions, PurchasePermissions, CustomerPermissions, OrderPermissions} from 'app/core/models/backend/permissions';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  getMenu() : Array<MenuItem> {
    const permissions : Array<string> = JSON.parse(localStorage.getItem("permissions"));
    var menuItems = Array<MenuItem>();
    menuItems.push({path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: ''});
    if (permissions.includes(UserPermissions.Access)) {
      menuItems.push({ path: '/users', title: 'Users',  icon:'groups', class: '' });
    }    
    if (permissions.includes(RolePermissions.Access)) {
      menuItems.push({ path: '/roles', title: 'Roles',  icon:'manage_accounts', class: '' });
    }
    if (permissions.includes(SupplierPermissions.Access)) {
      menuItems.push({ path: '/suppliers', title: 'Suppliers',  icon:'front_loader', class: '' });
    }
    if (permissions.includes(CategoryPermissions.Access)) {
      menuItems.push({ path: '/categories', title: 'Categories',  icon:'category', class: '' });
    }
    if (permissions.includes(ProductPermissions.Access)) {
      menuItems.push({ path: '/products', title: 'Products',  icon:'inventory', class: '' })
    }
    if (permissions.includes(CustomerPermissions.Access)) {
      menuItems.push({ path: '/customers', title: 'Customers',  icon:'diversity_3', class: '' })
    }
    if (permissions.includes(PurchasePermissions.Access)) {
      menuItems.push({ path: '/purchases', title: 'Purchases',  icon:'shopping_basket', class: '' })
    }
    if (permissions.includes(OrderPermissions.Access)) {
      menuItems.push({ path: '/orders', title: 'Orders',  icon:'local_shipping', class: '' })
    }
    return menuItems;
  }
}
