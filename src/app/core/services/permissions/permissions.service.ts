import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private userPermissions !: string[];

  constructor() { 
    this.userPermissions = JSON.parse(localStorage.getItem("permissions"));
  }

  hasPermission(permission : string) : boolean {
    return this.userPermissions.includes(permission);
  }
}
