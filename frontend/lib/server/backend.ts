import "server-only";
import {NextResponse} from "next/server";
import {createDemoSnapshot,isBootstrapResponse,type BootstrapResponse} from "@vayurakshak/shared/snapshot";
import {demoReply} from "@vayurakshak/shared/assistant";
import type {Profile} from "@vayurakshak/shared/types/user";
export type ReadEndpoint="bootstrap"|"air"|"routes"|"fires"|"calendar"|"wearable";
function backendUrl(endpoint:string){
 const base=new URL(process.env.BACKEND_URL||"http://127.0.0.1:4000");
 if(!["http:","https:"].includes(base.protocol)||base.username||base.password||base.search||base.hash)throw new Error("Invalid BACKEND_URL configuration");
 return new URL("api/"+endpoint,base.href.replace(/\/$/,"")+"/");
}
function timeout(){
 const value=Number(process.env.BACKEND_TIMEOUT_MS||5000);
 return Number.isInteger(value)&&value>=100&&value<=30000?value:5000;
}
function fallback(endpoint:ReadEndpoint){
 const data=createDemoSnapshot();const fetchedAt=new Date().toISOString();
 const warning="Backend is unavailable. Showing illustrative offline demo data.";
 if(endpoint==="bootstrap")return {data,source:"demo",fetchedAt,backendAvailable:false,warning} satisfies BootstrapResponse;
 const envelope=<T>(value:T)=>({data:value,source:"demo",fetchedAt,confidence:"Moderate"});
 if(endpoint==="air")return {conditions:envelope(data.current),forecast:envelope(data.forecast),weather:envelope({windKmh:data.current.windKmh,windDir:data.current.windDir,humidity:data.current.humidity}),fires:envelope(data.fireSignals),backendAvailable:false,warning};
 const values={routes:data.routes,fires:{signals:data.fireSignals,trend:data.fireTrend},calendar:data.calendarEvents,wearable:data.wearable};
 return {data:values[endpoint],source:"demo",backendAvailable:false,warning};
}
export async function proxyRead(endpoint:ReadEndpoint){
 try{
  const response=await fetch(backendUrl(endpoint),{cache:"no-store",signal:AbortSignal.timeout(timeout())});
  if(!response.ok)throw new Error("Backend request failed");
  const data:unknown=await response.json();
  if(endpoint==="bootstrap"&&!isBootstrapResponse(data))throw new Error("Invalid backend snapshot");
  if(!data||typeof data!=="object")throw new Error("Invalid backend response");
  return NextResponse.json(data,{headers:{"Cache-Control":"no-store","X-Vayu-Backend":"connected"}});
 }catch{
  if(process.env.DEMO_FALLBACK_ENABLED==="false")return NextResponse.json({error:"Backend is unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  return NextResponse.json(fallback(endpoint),{headers:{"Cache-Control":"no-store","X-Vayu-Backend":"offline-demo"}});
 }
}
export async function proxyAgent(question:string,profile:Profile){
 try{
  const response=await fetch(backendUrl("agent"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,profile}),cache:"no-store",signal:AbortSignal.timeout(timeout())});
  if(!response.ok)throw new Error("Backend assistant unavailable");
  const data=await response.json();
  if(typeof data.text!=="string"||data.source!=="demo")throw new Error("Invalid assistant response");
  return NextResponse.json(data,{headers:{"Cache-Control":"no-store"}});
 }catch{
  if(process.env.DEMO_FALLBACK_ENABLED==="false")return NextResponse.json({error:"Backend assistant is unavailable"},{status:503});
  return NextResponse.json({text:demoReply(question,profile),source:"demo",backendAvailable:false},{headers:{"Cache-Control":"no-store"}});
 }
}
