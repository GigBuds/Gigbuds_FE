import { BaseUser } from "./_baseUser";

export interface Admin extends BaseUser {
    role: "admin";
}

