export interface PagedList<T> {
    items : Array<T>;
    pageIndex: number;
    totalPages : number;
    rowsCount : number;
    hasPreviousPage: boolean;
    hasNextPage : boolean;
};

export interface Address {
    country: string;
    state : string;
    city: string;
    zipCode : string;
    line1:  string;
    line2 : string | null;
};
