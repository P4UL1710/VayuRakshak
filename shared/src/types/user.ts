export type Profile = "General" | "Child" | "Asthma" | "Elderly" | "Fitness";
export type Service = "Calendar" | "Wearable" | "Purifier" | "Telegram / WhatsApp";
export interface Preferences { profile: Profile; personalized: boolean; notifications: boolean; services: Record<Service, boolean> }
