export interface Package_type {
    id: number;
    poster: File | null;
    title: string;
    description: string;
    duration: number | "";
    price: number | "";
    gender: string;
    
    package_category_id?: number
    is_standalone?: boolean
}

export interface Package_category_type {
    id: number
    name: string
}
export interface Package_service {
    id: number
    package_id: number
    service_id: number
}

export interface Package_json {
    package: Package_type,
    package_service: Package_service 
}
export interface Service_json {
    service: Package_type,
    package_category: Package_category_type
}