import type { User_type } from "./user";

export interface Membership_type {
    id: number;
    tier: string;
}
export interface Membership_privilege_type {
    id: number;
    membership_id: number,
    list: string;
}
export interface Membership_customer_type {
    id: number;
    user_customer_id: number;
    membership_id: number;
    code: string;
    date_joined: string;
}

export interface Membership_json {
    membership: Membership_type,
    membership_privilege: Membership_privilege_type[]
}
export interface Membership_customer_json {
    membership: Membership_type;
    membership_customer: Membership_customer_type;
    // user_customer: User_customer_type;
    user: User_type;
}