import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Role } from "app/core/models/backend/roles";
import { RolesService } from "app/core/services/roles/roles.service";
import { Observable } from 'rxjs';

@Injectable()
export class RolesResolver implements Resolve<Role[]> {
    constructor(private rolesService : RolesService) {}
    resolve() : Observable<Role[]> {
        return this.rolesService.getAllRoles(null, null);
    }
};