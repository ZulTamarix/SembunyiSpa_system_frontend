import type { User_type } from "./user";

export interface Booking_type {
    id: number;
    user_id: number;
    package_id?: number | null;
    date_start: string;
    time_start: string;
    time_end: string;
    booking_type: 'prepaid' | 'walkin';
    status: 'booked' | 'arrived' | 'in_treatment' | 'completed' | 'cancelled';
    payment: 'pending' | 'paid' | 'cancel';
    remark: string
}
export interface Booking_selected_type {
    id: number;
    booking_id: number;
    service_id: number;
    room_id: number;
    user_id: number;
}

export interface Booking_json {
    booking: Booking_type;
    booking_selected: Booking_selected_type;
    user: User_type;
}