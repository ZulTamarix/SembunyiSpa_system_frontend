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
  specialty: string;
  code: string;
}

// JSON
// export interface User_therapist_json {
//   user_therapist: User_therapist_type
//   user: User_type
// }