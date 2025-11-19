export interface Permission {
    id: string;
    name: string;
    required: boolean;
    selected : boolean;
    order: number;
};
export interface ModuleWithPermissions {
    id : string;
    name : string;
    order: number;
    permissions: Permission[];
};