import { ModuleWithPermissions } from '../modules';
export { ModuleWithPermissions } from '../modules';

export interface Role {
    id : string;
    name : string;
    active : string;  
};

export interface RoleDetails {
    id : string;
    name : string;
    description: string;
    active : string;
    modules: ModuleWithPermissions[];
};

export interface CreateModuleWithPermissionsRequest {
    id : string;
    permissionsIds : string[];
};

export interface CreateRoleRequest {
    name : string;
    description : string;
    modules : CreateModuleWithPermissionsRequest[];
};

export interface EditRoleRequest {
    roleId : string;
    name : string;
    description : string;
    modules : EditModuleWithPermissionsRequest[];
}

export interface EditModuleWithPermissionsRequest {
    id : string;
    permissionsIds : string[];
};