export interface Booking_type {
    id: number;
    user_id: number;
    package_id?: number;
    code: string;
    date_start: string;
    time_start: string;
    time_end: string;
    booking_type: 'walkin' | 'prepaid';
    status: 'booked' | 'arrived' | 'in_treatment' | 'completed' | 'cancelled';
    payment: 'pending' | 'paid' | 'cancel';
}