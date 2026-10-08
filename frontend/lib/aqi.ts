import type { AQICategory } from "@vayurakshak/shared/types/air";
// Product-demo bands mandated by the brief, NOT official CPCB AQI categories.
// Live adapters must use the data provider's actual index and classification.
export function categorize(aqi: number): {label:AQICategory;color:string} {
 if (aqi<=50) return {label:"Good",color:"#22C55E"};
 if (aqi<=100) return {label:"Moderate",color:"#EAB308"};
 if (aqi<=250) return {label:"Poor",color:"#F97316"};
 if (aqi<=350) return {label:"Very Poor",color:"#EF4444"};
 return {label:"Severe",color:"#7F1D1D"};
}
