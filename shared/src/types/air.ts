export type AQICategory = "Good" | "Moderate" | "Poor" | "Very Poor" | "Severe";
export interface ForecastPoint { label: string; aqi: number; peak?: boolean }
export interface Conditions { aqi: number; pm25: number; windKmh: number; windDir: string; humidity: number; updated: string }
export interface DataEnvelope<T> { data: T; source: "demo" | "live" | "cached"; fetchedAt: string; confidence?: "Low" | "Moderate" | "High" }
