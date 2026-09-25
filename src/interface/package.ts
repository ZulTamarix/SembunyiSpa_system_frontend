export interface Package_type {
    id: number;
    poster: File | null;
    title: string;
    type: string;
    description: string;
    duration: number | "";
    price: number | "";
    gender: string;
}

export interface Package_json {
    package: Package_type
    package_detail: {
        id: number;
        detail: string
    }
    package_therapist: {
        id: number;
        user_therapist_id: string
    }
    package_room: {
        id: number;
        room_id: string
    }
}