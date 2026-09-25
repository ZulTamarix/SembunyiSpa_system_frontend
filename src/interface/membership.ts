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

export interface Membership_json {
    membership: Membership_type,
    membership_privilege: Membership_privilege_type[],
    user: User_type;
}
