import {createServer,type IncomingMessage,type ServerResponse} from "node:http";
import type {BackendConfig} from "./config";
import {bootstrap,airData,assistant} from "./services/demo";
import type {Profile} from "@vayurakshak/shared/types/user";
class RequestError extends Error{constructor(public status:number,message:string){super(message);}}
function json(response:ServerResponse,status:number,value:unknown){response.writeHead(status,{"Content-Type":"application/json; charset=utf-8"});response.end(JSON.stringify(value));}
async function readJson(request:IncomingMessage,maxBytes:number){
 if(request.headers["content-type"]?.split(";")[0].trim()!=="application/json")throw new RequestError(415,"Content-Type must be application/json");
 if(Number(request.headers["content-length"])>maxBytes)throw new RequestError(413,"Request body too large");
 return new Promise<unknown>((resolve,reject)=>{
  let chunks:Buffer[]=[];let size=0;let rejected=false;
  request.on("data",(chunk:Buffer)=>{
   if(rejected)return;size+=chunk.length;
   if(size>maxBytes){rejected=true;chunks=[];reject(new RequestError(413,"Request body too large"));return;}
   chunks.push(chunk);
  });
  request.on("end",()=>{if(rejected)return;try{resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));}catch{reject(new RequestError(400,"Invalid JSON body"));}});
  request.on("aborted",()=>reject(new RequestError(400,"Request was interrupted")));
  request.on("error",()=>reject(new RequestError(400,"Unable to read request body")));
 });
}
export function createApp(config:BackendConfig){
 const server=createServer(async(request,response)=>{
  response.setHeader("Cache-Control","no-store");
  response.setHeader("X-Content-Type-Options","nosniff");
  response.setHeader("Referrer-Policy","no-referrer");
  const origin=request.headers.origin;
  if(origin&&!config.corsOrigins.includes(origin)){json(response,403,{error:"Origin is not allowed"});return;}
  if(origin){response.setHeader("Access-Control-Allow-Origin",origin);response.setHeader("Vary","Origin");}
  if(request.method==="OPTIONS"){response.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");response.setHeader("Access-Control-Allow-Headers","Content-Type");response.writeHead(204);response.end();return;}
  try{
   const path=new URL(request.url??"/","http://backend.local").pathname;
   if(path==="/health"||path==="/healthz"){
    if(request.method!=="GET"){response.setHeader("Allow","GET");json(response,405,{error:"Method not allowed"});return;}
    json(response,200,{status:"ok",service:"vayurakshak-backend",mode:config.dataMode});return;
   }
   const getters:Record<string,()=>unknown>={
    "/api/bootstrap":bootstrap,"/api/air":airData,
    "/api/routes":()=>({data:bootstrap().data.routes,source:"demo"}),
    "/api/fires":()=>({data:{signals:bootstrap().data.fireSignals,trend:bootstrap().data.fireTrend},source:"demo"}),
    "/api/calendar":()=>({data:bootstrap().data.calendarEvents,source:"demo"}),
    "/api/wearable":()=>({data:bootstrap().data.wearable,source:"demo"})
   };
   if(getters[path]){if(request.method!=="GET"){response.setHeader("Allow","GET");json(response,405,{error:"Method not allowed"});return;}json(response,200,getters[path]());return;}
   if(path==="/api/agent"){
    if(request.method!=="POST"){response.setHeader("Allow","POST");json(response,405,{error:"Method not allowed"});return;}
    const input=await readJson(request,config.maxBodyBytes);
    if(!input||typeof input!=="object")throw new RequestError(400,"A question and profile are required");
    const {question,profile="General"}=input as {question?:unknown;profile?:unknown};
    if(typeof question!=="string"||!question.trim()||question.length>500)throw new RequestError(400,"Question must contain 1–500 characters");
    if(typeof profile!=="string"||!["General","Child","Asthma","Elderly","Fitness"].includes(profile))throw new RequestError(400,"Unsupported profile");
    json(response,200,assistant(question.trim(),profile as Profile));return;
   }
   json(response,404,{error:"Endpoint not found"});
  }catch(error){
   if(error instanceof RequestError)json(response,error.status,{error:error.message});
   else{console.error("API request failed");json(response,500,{error:"Unable to complete the request"});}
  }
 });
 server.requestTimeout=config.requestTimeoutMs;
 server.headersTimeout=config.requestTimeoutMs;
 server.keepAliveTimeout=5000;
 server.maxHeadersCount=50;
 return server;
}
