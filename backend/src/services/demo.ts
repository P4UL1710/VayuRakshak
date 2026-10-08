import {createDemoSnapshot,type BootstrapResponse} from "@vayurakshak/shared/snapshot";
import {demoReply} from "@vayurakshak/shared/assistant";
import type {Profile} from "@vayurakshak/shared/types/user";
export function bootstrap():BootstrapResponse{return {data:createDemoSnapshot(),source:"demo",fetchedAt:new Date().toISOString(),backendAvailable:true};}
export function airData(){
 const snapshot=createDemoSnapshot();const fetchedAt=new Date().toISOString();
 const envelope=<T>(data:T)=>({data,source:"demo" as const,fetchedAt,confidence:"Moderate" as const});
 return {conditions:envelope(snapshot.current),forecast:envelope(snapshot.forecast),
  weather:envelope({windKmh:snapshot.current.windKmh,windDir:snapshot.current.windDir,humidity:snapshot.current.humidity}),
  fires:envelope(snapshot.fireSignals),backendAvailable:true};
}
export function assistant(question:string,profile:Profile){return {text:demoReply(question,profile),source:"demo",backendAvailable:true};}
// Implement CPCB/WAQI, weather, NASA FIRMS and ML adapters here.
// Credentials belong to backend/.env only. Adding one does not enable live actions.
// No device/calendar/message write endpoint exists in this read-only demo backend.
