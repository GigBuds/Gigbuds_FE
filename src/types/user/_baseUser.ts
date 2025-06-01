export interface BaseUser {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture: string;
}

export interface BaseUserCreate {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
}