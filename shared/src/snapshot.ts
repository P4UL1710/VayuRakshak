import {current,forecast,tomorrow,exposureWeek} from "./data/mock-air-data";
import {routes} from "./data/mock-route-data";
import {fireSignals,fireTrend} from "./data/mock-fire-data";
import {calendarEvents} from "./data/mock-calendar-data";
export function createDemoSnapshot(){
 return {current,forecast,tomorrow,exposureWeek,routes,fireSignals,fireTrend,calendarEvents,
  wearable:{sleepScore:72,restingHrDelta:4,hrvDelta:-9}};
}
export type DemoSnapshot=ReturnType<typeof createDemoSnapshot>;
export interface BootstrapResponse {
 data:DemoSnapshot;
 source:"demo";
 fetchedAt:string;
 backendAvailable:boolean;
 warning?:string;
}
export function isBootstrapResponse(value:unknown):value is BootstrapResponse {
 if(!value || typeof value!=="object")return false;
 const payload=value as Partial<BootstrapResponse>;
 const data=payload.data;
 return payload.source==="demo"&&typeof payload.fetchedAt==="string"&&typeof payload.backendAvailable==="boolean"&&
  !!data&&Number.isFinite(data.current?.aqi)&&Number.isFinite(data.current?.pm25)&&
  Array.isArray(data.forecast)&&data.forecast.length>0&&data.forecast.every(p=>typeof p.label==="string"&&Number.isFinite(p.aqi))&&
  Array.isArray(data.routes)&&data.routes.length===3&&data.routes.every(r=>typeof r.id==="string"&&Number.isFinite(r.score)&&Number.isFinite(r.minutes))&&
  !!data.tomorrow&&Number.isFinite(data.tomorrow.peakAqi)&&!!data.fireSignals&&Number.isFinite(data.fireSignals.detections)&&
  Array.isArray(data.fireTrend)&&Array.isArray(data.exposureWeek)&&Array.isArray(data.calendarEvents)&&
  !!data.wearable&&Number.isFinite(data.wearable.sleepScore);
}
