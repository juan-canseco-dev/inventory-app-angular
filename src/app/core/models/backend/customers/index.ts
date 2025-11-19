import { Address } from '../shared';
export { Address } from '../shared';

export interface CreateCustomerRequest {
    dni: string;
    phone: string;
    fullname: string;
    address: Address;
};

export interface UpdateCustomerRequest {
    customerId: number;
    dni: string;
    phone: string;
    fullname: string;
    address: Address;
};

export interface GetCustomersQueryParams {
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    dni: string ;
    fullname: string;
    active: boolean | null;
};

export interface Customer {
    id: number;
    dni: string;
    phone: string;
    fullname: string;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};

export interface CustomerDetails {
    id: number;
    dni: string;
    phone: string;
    fullname: string;
    address: Address;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};