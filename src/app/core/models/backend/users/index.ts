import { RoleDetails } from "../roles";
export { RoleDetails } from "../roles";

export interface CreateUserRequest {
    roleId : string;
    fullname : string;
    email : string;
    password : string;
};


export interface UserPermission {
    moduleId : string;
    permissionId : string;
};

export interface UserDetails {
    id : string;
    fullname: string;
    email : string;
    active : boolean;
    role: RoleDetails
};

export interface User {
    id : string;
    role : string;
    fullname : string;
    active : string;
};

export interface CreateUserRequest {
    roleId : string;
    fullname : string;
    email : string;
    password : string;
};

export interface EditUserRequest { 
    userId : string;
    roleId : string;
    fullname : string;
};