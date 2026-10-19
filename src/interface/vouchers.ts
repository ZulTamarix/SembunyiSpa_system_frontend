import type { User_type } from "./user";

export interface Voucher_type {
    id: number;
    code: string;
    description: string;
    type: 'gift' | 'promo';
    date_expired: string | null;
    status: string;
    discount_type: 'discount_amount' | 'discount_percentage' | 'time_extension' | 'complimentary';
    discount_value: number | '';
    quantity: number | ''
}
export interface Voucher_customer_type {
    id: number,
    voucher_id: number,
    date_expired: string,

    user: User_type
    voucher: Voucher_type
}