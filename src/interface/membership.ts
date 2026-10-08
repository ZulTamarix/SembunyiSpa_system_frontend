import type { User_type } from "./user";
import type { Voucher_type } from "./vouchers";

export interface Membership_type {
    id: number;
    tier: string;
    voucher?: Voucher_type[]
}

export interface Membership_json {
    membership: Membership_type,
    voucher?: Voucher_type[]
    user: User_type;
}
