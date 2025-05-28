import { BaseUser, BaseUserCreate } from "./_baseUser";

export interface Employer extends BaseUser {
    businessName: string;
    role: "employer";
}

export interface EmployerCreate extends BaseUserCreate {
    role: "employer";
}

export interface EmployerUpdate {
    name?: string;
    email?: string;
    phone?: string;
}

export interface EmployerDelete {
    id: string;
}

