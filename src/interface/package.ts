export interface Package_type {
    id: number;
    poster: File | null;
    title: string;
    type: string;
    description: string;
    duration: number;
    price: number;
    gender: string;
}

export interface Package_json {
    MAIN_DATA: Package_type
    detail: {
        id: number;
        detail: string
    }
    therapist: {
        id: number;
        user_therapist_id: string
    }
    room: {
        id: number;
        room_id: string
    }
}