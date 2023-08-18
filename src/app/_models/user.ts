export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    profileImageUrl: string | null;
    role: Role;
    token: string;
};

export enum Role {
    PRODUCT_MANAGER = 'PRODUCT_MANAGER',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    DEVELOPER = 'DEVELOPER',
    SOFTWARE_COMPANY = 'SOFTWARE_COMPANY'
};