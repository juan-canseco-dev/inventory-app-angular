export interface Category {
    id: number;
    name: string;
    active: boolean;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
};

export interface CreateCategoryRequest {
    name : string;
};

export interface EditCategoryRequest {
    categoryId: number;
    name: string;
};

export interface GetCategoriesQueryParams {
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    name: string;
    active : boolean | null;
};
