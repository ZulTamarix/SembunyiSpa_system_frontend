import type { User_type } from "./user";

export interface Voucher_type {
    id: number;
    code: string;
    description: string;
    type: 'gift' | 'promo';
    date_expired: string;
    status: string;
    discount_type: 'discount_amount' | 'discount_percentage' | 'time_deduction' | 'complimentary';
    discount_value: number | '';
    quantity: number | ''
}
export interface Voucher_user_type {
    id: number,
    user: User_type
}