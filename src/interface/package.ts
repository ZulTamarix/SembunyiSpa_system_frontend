export interface Package_type {
    id: number;
    poster: File | null;
    title: string;
    description: string;
    duration: number | "";
    price: number | "";
    gender: string;
    
    service_category_id?: number
    is_standalone?: boolean
}

export interface Service_category_type {
    id: number
    name: string
}

export interface Package_json {
    package: Package_type
    package_detail: {
        id: number;
        detail: string
    }
    package_therapist: {
        id: number;
        user_id: string
    }
    package_room: {
        id: number;
        room_id: string
    }
}
export interface Service_json {
    service: Package_type,
    service_category: Service_category_type
}