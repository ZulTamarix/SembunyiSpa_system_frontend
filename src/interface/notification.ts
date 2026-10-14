import type { User_type } from "./user"

export interface Notification_type {
    id: number
    user_id: number
    type: string
    title: string
    description: string
}

export interface Notification_json {
    notification: Notification_type,
    user: User_type
}