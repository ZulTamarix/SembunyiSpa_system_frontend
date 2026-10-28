import type { Package_type } from "./package";
import type { Room_type } from "./room";
import type { User_type } from "./user";

export interface Booking_type {
    id: number;
    user_id: number;
    user_shared_id: number | null;
    package_id?: number | null;
    date_start: string;
    time_start: string;
    time_end: string;
    booking_type: 'prepaid' | 'walkin';
    status: 'pending' | 'booked' | 'in_treatment' | 'completed' | 'cancelled';
    payment: 'pending' | 'paid' | 'cancel';
    remark: string;

    price_original: number | "";
    price_discount: number | "";
    price_final: number | "";

    recorded_time_start?: string;
    recorded_time_end?: string;

    booking_selected?: Booking_selected_type
}
export interface Booking_selected_type {
    id: number;
    booking_id: number;
    service_id: number;
    room_id: number;
    user_id: number;

    user?: User_type
    room?: Room_type
    package?: Package_type
}

export interface Booking_json {
    booking: Booking_type;
    booking_selected: Booking_selected_type;
    user: User_type;
}