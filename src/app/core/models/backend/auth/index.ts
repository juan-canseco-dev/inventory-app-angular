export interface LoginRequest {
    email : string;
    password : string;
};

export interface UpdateUserInfoRequest {
    fullname : string;
    email : string;
    currentPassword : string;
    newPassword : string;
};

export interface LoginResponse {
    userId : string;
    role: string;
    email: string;
    fullname: string;
    permissions : Array<string>;
    isVerified: boolean;
    token : string;
};

export class UserProfile {
    userId : string;
    role : string;
    email : string;
    fullname : string;
    isVerified: boolean;
};