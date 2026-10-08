// Illustrative scenario, not a verified real-time measurement.
// Brief-defined display bands intentionally differ from official Indian AQI bands.
import type { Conditions, ForecastPoint } from "../types/air";
export const current: Conditions = { aqi: 218, pm25: 142, windKmh: 7, windDir: "NW", humidity: 61, updated: "2 minutes ago (demo)" };
export const tomorrow = { peakAqi: 286, window: "7:00 AM–10:30 AM", exposureReduction: 31 };
export const forecast: ForecastPoint[] = [
 {label:"Now",aqi:218}, {label:"Tonight",aqi:240}, {label:"Tomorrow 7 AM",aqi:270,peak:true},
 {label:"Tomorrow 9 AM",aqi:286,peak:true}, {label:"Tomorrow 3 PM",aqi:215}, {label:"Tomorrow 9 PM",aqi:245},
 {label:"Day 2 · 8 AM",aqi:262,peak:true}, {label:"Day 2 · 4 PM",aqi:190}, {label:"Day 3 · 8 AM",aqi:205}, {label:"Day 3 · evening",aqi:182}
];
export const actions = [
 {text:"Cleaner route prepared for tomorrow’s college commute",status:"Ready",href:"/routes"},
 {text:"Purifier pre-start available for 6:30 AM",status:"Needs approval",href:"/automations"},
 {text:"Outdoor run found; a safer calendar slot suggested",status:"Insight",href:"/calendar"},
 {text:"Punjab fire activity increased; wind may affect Delhi",status:"Monitoring",href:"/fire-tracker"}
];
export const exposureWeek = [
 {label:"Fri",value:76},{label:"Sat",value:53},{label:"Sun",value:42},
 {label:"Mon",value:81},{label:"Tue",value:69},{label:"Wed",value:86},{label:"Thu",value:62}
];
