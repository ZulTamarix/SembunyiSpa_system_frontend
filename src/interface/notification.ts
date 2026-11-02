import type { User_type } from "./user"

export interface Notification_type {
    id: number
    role: 'customer' | 'therapist'
    title: string
    description: string

    created_at?: string,
    user?: User_type
}

export interface Notification_json {
    notification: Notification_type,
    user: User_type
}