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
    MAIN_DATA: Membership_type,
    privilege: Membership_privilege_type[]
}