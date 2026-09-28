export interface Roster_type {
    id: number;
    date: string;
    user_id: number;
    roster_leave_id: number;
    roster_shift_id: number;
}

export interface Roster_leave_type {
    id: number;
    icon: string;
    description: string;
}

export interface Roster_shift_type {
    id: number;
    icon: number | "";
    time_start: string;
    time_end: string;
}

export interface Roster_json {
    roster: Roster_type,
    roster_leave: Roster_leave_type,
    roster_shift: Roster_shift_type
}