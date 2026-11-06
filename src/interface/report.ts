export interface Report_customer_type {
    id: number,
    name: string,
    phoneNo: string,
    price: number,
    total: number,
}
export interface Report_treatment_type {
    id: number,
    treatment: string,
    category: string,
    total: number,
}
export interface Report_room_type {
    id: number,
    room: string,
    description: string,
    total: number,
}
export interface Report_therapist_type {
    id: number,
    name: string,
    specialty: string,
    total: number,
}export interface Report_revenue_type {
    id: number,
    date: string,
    price: number,
}