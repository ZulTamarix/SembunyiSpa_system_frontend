export interface User_type {
  id: string;
  role: 'admin'|'therapist'|'customer'|'';
  name: string;
  email: string;
  phoneNo: string;
  status: string;
  password: string;
}
export interface User_therapist_type {
  id: string;
  user: User_type;
  position: string;
  code: string;
}
export interface User_customer_type {
  id: string;
  user: User_type;
  membership_id?: string;
  membership_code?: string;
  total_booking?: number;
  date_joined: string;
}

// JSON
export interface User_therapist_json {
  MAIN: User_therapist_type
  user: User_type
}
export interface User_customer_json {
  MAIN: User_customer_type
  user: User_type
}