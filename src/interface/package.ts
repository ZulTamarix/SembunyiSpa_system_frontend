export interface Package_type {
    id: string;
    poster: File | null;
    title: string;
    type: string;
    description: string;
    duration: number;
    price: number;
    gender: string;
}

export interface Package_json {
    MAIN: Package_type
    detail: {
        id: string;
        detail: string
    }
    therapist: {
        id: string;
        user_therapist_id: string
    }
    room: {
        id: string;
        room_id: string
    }
}