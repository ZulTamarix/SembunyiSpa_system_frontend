export interface User_type {
  id: number;
  role: 'admin'|'therapist'|'customer'|'';
  name: string;
  email: string;
  phoneNo: string;
  status: string;
  password: string;
}
export interface User_therapist_type {
  id: number;
  user: User_type;
  position: string;
  code: string;
}
export interface User_customer_type {
  id: number;
  user: User_type;
  total_booking: number;
  date_joined: string;
}

// JSON
export interface User_therapist_json {
  MAIN_DATA: User_therapist_type
  user: User_type
}
export interface User_customer_json {
  MAIN_DATA: User_customer_type
  user: User_type
}