import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer} from "node:net";
import {once} from "node:events";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const children=[];
async function freePort(){const socket=createServer();socket.listen(0,"127.0.0.1");await once(socket,"listening");const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));return port;}
function start(script,cwd,env){
 const child=spawn(process.execPath,[script],{cwd,env:{...process.env,...env},stdio:["ignore","pipe","pipe"]});
 children.push(child);let output="";child.stdout.on("data",chunk=>{output+=chunk;});child.stderr.on("data",chunk=>{output+=chunk;});child.logs=()=>output;
 return child;
}
async function ready(base,child){
 for(let i=0;i<100;i++){
  if(child.exitCode!==null||child.signalCode!==null)throw new Error("Service exited: "+child.logs());
  try{if((await fetch(base,{signal:AbortSignal.timeout(200)})).ok)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,100));
 }
 throw new Error("Service failed to become ready: "+child.logs());
}
async function stop(child){if(child.exitCode!==null||child.signalCode!==null)return;const exited=once(child,"exit");child.kill();await exited;}
try{
 const backendPort=await freePort();const frontendPort=await freePort();
 const backend=start(path.join(root,"backend/dist/server.js"),path.join(root,"backend"),{PORT:String(backendPort),HOST:"127.0.0.1",DATA_MODE:"demo"});
 const backendBase="http://127.0.0.1:"+backendPort;
 await ready(backendBase+"/health",backend);
 const frontend=start(path.join(root,"frontend/scripts/start.mjs"),path.join(root,"frontend"),{PORT:String(frontendPort),FRONTEND_HOST:"127.0.0.1",BACKEND_URL:backendBase,BACKEND_TIMEOUT_MS:"300",DEMO_FALLBACK_ENABLED:"true"});
 const frontendBase="http://127.0.0.1:"+frontendPort;
 await ready(frontendBase+"/api/health",frontend);
 const connected=await fetch(frontendBase+"/api/bootstrap");assert.equal(connected.status,200);
 const payload=await connected.json();assert.equal(payload.backendAvailable,true);assert.equal(payload.data.current.aqi,218);
 const chat=await fetch(frontendBase+"/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:"Which route tomorrow?",profile:"General"})});
 assert.equal(chat.status,200);assert.equal((await chat.json()).backendAvailable,true);
 const stylesheet=await fetch(frontendBase+"/");const html=await stylesheet.text();const asset=html.match(/href="([^"]+\.css[^"]*)"/)?.[1];assert.ok(asset,"Standalone server must include CSS");assert.equal((await fetch(new URL(asset,frontendBase))).status,200);
 console.log("PASS: compiled backend, frontend standalone, proxy, assistant and static CSS");
 await stop(backend);
 const offline=await fetch(frontendBase+"/api/bootstrap");assert.equal(offline.status,200);
 assert.equal((await offline.json()).backendAvailable,false);assert.equal(offline.headers.get("x-vayu-backend"),"offline-demo");
 console.log("PASS: backend outage returns labelled demo fallback");
 await stop(frontend);
 const strict=start(path.join(root,"frontend/scripts/start.mjs"),path.join(root,"frontend"),{PORT:String(frontendPort),FRONTEND_HOST:"127.0.0.1",BACKEND_URL:backendBase,BACKEND_TIMEOUT_MS:"300",DEMO_FALLBACK_ENABLED:"false"});
 await ready(frontendBase+"/api/health",strict);
 assert.equal((await fetch(frontendBase+"/api/bootstrap")).status,503);
 console.log("PASS: fallback can be disabled with a runtime environment variable");
}finally{await Promise.all(children.map(stop));}
