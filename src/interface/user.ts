import type { Booking_type } from "./booking";
import type { Membership_type } from "./membership";
import type { Voucher_type } from "./vouchers";

export interface User_type {
  id: number | "";
  role: 'admin' | 'therapist' | 'customer' | 'walkin' | '';
  name: string;
  email: string;
  phoneNo: string;
  status: string;
  
  password: string;

  date_joined: string;
  membership_id?: number | "";
  membership_date_expired?: string;
  specialty: string;
  code: string;

  voucher_customers?: Voucher_type[]
  membership?: Membership_type
  booking?: Booking_type[]
}

// JSON
export interface Schedule_therapist_json {
  user: User_type;
  booking_selected: Booking_selected_type[];
}

export interface Booking_selected_type {
  id: number;
  booking_id: number;
  package_id: number | null;
  room_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  booking: Booking_type;
}