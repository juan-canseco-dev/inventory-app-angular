import { Address } from '../shared/index'; 
export { Address } from '../shared/index'; 

export interface Supplier {
    id : number;
    companyName : string;
    contactName : string;
    contactPhone : string;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};

export interface SupplierDetails {
    id : number;
    companyName : string;
    contactName : string;
    contactPhone : string;
    address : Address;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};

export interface CreateSupplierRequest {
    companyName : string;
    contactName : string;
    contactPhone : string;
    address : Address;
};

export interface EditSupplierRequest {
    supplierId : number;
    companyName : string;
    contactName : string;
    contactPhone : string;
    address : Address;
};