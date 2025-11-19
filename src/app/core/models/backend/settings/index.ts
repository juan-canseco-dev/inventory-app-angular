export interface CompanyInfo {
    id : string;
    name : string;
    logoUri: string;
    phone : string;
    country : string;
    state : string;
    city  : string;
    zip : string;
    line1 : string;
    line2 : string;
};

export interface UpdateCompanyInfo {
    name : string;
    phone : string;
    country : string;
    state : string;
    city : string;
    zip : string;
    line1:  string;
    line2 : string;
    photo : File | null;
};