import test from "node:test";
import assert from "node:assert/strict";
import {once} from "node:events";
import {createApp} from "../src/app";
import {readConfig} from "../src/config";
import {isBootstrapResponse} from "@vayurakshak/shared/snapshot";
async function withServer(run:(base:string)=>Promise<void>){
 const server=createApp(readConfig({CORS_ORIGINS:"https://frontend.example"}));
 server.listen(0,"127.0.0.1");await once(server,"listening");
 const address=server.address();assert.ok(address&&typeof address==="object");
 try{await run("http://127.0.0.1:"+address.port);}finally{server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}
}
test("environment configuration rejects unsupported live mode and invalid ports",()=>{
 assert.throws(()=>readConfig({PORT:"0"}),/PORT/);assert.throws(()=>readConfig({PORT:"abc"}),/PORT/);
 assert.throws(()=>readConfig({DATA_MODE:"live"}),/DATA_MODE/);
 assert.throws(()=>readConfig({CORS_ORIGINS:"*"}));
 assert.equal(readConfig({}).port,4000);
});
test("health and bootstrap report source and availability",()=>withServer(async base=>{
 const health=await fetch(base+"/health");assert.equal(health.status,200);assert.equal((await health.json()).status,"ok");
 const response=await fetch(base+"/api/bootstrap");const data=await response.json();
 assert.equal(response.headers.get("cache-control"),"no-store");assert.ok(isBootstrapResponse(data));assert.equal(data.backendAvailable,true);assert.equal(data.data.current.aqi,218);
}));
test("feature APIs return the shared mock scenario",()=>withServer(async base=>{
 for(const endpoint of ["air","routes","fires","calendar","wearable"]){const response=await fetch(base+"/api/"+endpoint);assert.equal(response.status,200);const data=await response.json();assert.equal(endpoint==="air"?data.conditions.source:data.source,"demo");}
}));
test("only explicitly configured cross-origin callers are allowed",()=>withServer(async base=>{
 const denied=await fetch(base+"/api/bootstrap",{headers:{Origin:"https://untrusted.example"}});assert.equal(denied.status,403);
 const allowed=await fetch(base+"/api/bootstrap",{headers:{Origin:"https://frontend.example"}});assert.equal(allowed.status,200);assert.equal(allowed.headers.get("access-control-allow-origin"),"https://frontend.example");
 const preflight=await fetch(base+"/api/agent",{method:"OPTIONS",headers:{Origin:"https://frontend.example"}});assert.equal(preflight.status,204);
}));
test("assistant accepts valid input and keeps consequential actions as suggestions",()=>withServer(async base=>{
 const response=await fetch(base+"/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:"approve purifier",profile:"Asthma"})});
 assert.equal(response.status,200);const data=await response.json();assert.equal(data.source,"demo");assert.match(data.text,/without approval/);
}));
test("assistant rejects malformed payloads and unsupported profiles",()=>withServer(async base=>{
 for(const body of ["{",JSON.stringify({question:"",profile:"General"}),JSON.stringify({question:"Hello",profile:"Invalid"}),JSON.stringify({question:"x".repeat(501)})]){
  const response=await fetch(base+"/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body});assert.equal(response.status,400);
 }
 const wrongType=await fetch(base+"/api/agent",{method:"POST",body:"hello"});assert.equal(wrongType.status,415);
 const tooLarge=await fetch(base+"/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:"x".repeat(17000)})});assert.equal(tooLarge.status,413);
}));
test("unsupported methods and mutation paths cannot perform actions",()=>withServer(async base=>{
 const response=await fetch(base+"/api/calendar",{method:"POST"});assert.equal(response.status,405);
 assert.equal((await fetch(base+"/api/devices",{method:"POST"})).status,404);
 assert.equal((await fetch(base+"/api/unknown")).status,404);
}));
