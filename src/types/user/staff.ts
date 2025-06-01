import { BaseUser } from "./_baseUser";

export interface Staff extends BaseUser {
    role: "staff";
}