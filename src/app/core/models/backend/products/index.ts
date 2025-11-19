export interface Category {
    categoryId: number;
    name: string;
};

export interface Supplier {
    supplierId: number;
    name: string;
};

export interface Product {
    id: number;
    name: string;
    quantity: number;
    purchasePrice: number;
    salePrice: number;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};

export interface ProductDetails {
    id: number;
    name: string;
    category : Category;
    supplier: Supplier;
    quantity: number;
    purchasePrice: number;
    salePrice: number;
    createdAt : Date | null;
    createdBy : string | null;
    updatedAt:  Date | null;
    updatedBy : string | null;
    active : boolean;
};

export interface CreateProductRequest {
    supplierId: number;
    categoryId: number;
    name: string;
    purchasePrice: number;
    salePrice: number;
};

export interface UpdateProductRequest {
    productId: number;
    supplierId: number;
    categoryId: number;
    name: string;
    purchasePrice: number;
    salePrice: number;
};

export interface GetProductsQueryParams {
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    name: string;
    categoryId: number | null;
    supplierId: number | null;
    active : boolean | null;
};