export interface Banner_type {
    id: number
    poster: File | null;
    title: string;
    description: string;
    status: 'active' | 'inactive';
    date_expired: string;
}