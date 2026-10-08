export interface Package_type {
    id: number;
    poster: File | null;
    title: string;
    description: string;
    duration: number | "";
    price: number | "";
    gender: string;
    detail: string;
    type: 'package' | 'service'

    package_category_id: number
    is_standalone: boolean | null
}

export interface Package_category_type {
    id: number
    name: string
}
export interface Package_service_type {
    id: number
    package_id: number
    service_id: number
}

export interface Package_json {
    package: Package_type,
    package_category: Package_category_type
    package_service: Package_service_type
}
export interface Service_json {
    service: Package_type,
    package_category: Package_category_type
}