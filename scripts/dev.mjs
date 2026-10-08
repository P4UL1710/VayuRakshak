import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import path from "node:path";
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
if(existsSync(path.join(root,".env")))process.loadEnvFile(path.join(root,".env"));
const production=process.argv.includes("--production");
const frontendRequire=createRequire(path.join(root,"frontend/package.json"));
const backendRequire=createRequire(path.join(root,"backend/package.json"));
const frontend=production?[path.join(root,"frontend/scripts/start.mjs")]:[frontendRequire.resolve("next/dist/bin/next"),"dev","--hostname","0.0.0.0","--port",process.env.FRONTEND_PORT||"3000"];
const backend=production?[path.join(root,"backend/dist/server.js")]:[backendRequire.resolve("tsx/cli"),"watch","src/server.ts"];
const children=[];
let stopping=false;
function stop(code=0){
 if(stopping)return;stopping=true;
 for(const child of children){
  if(!child.pid)continue;
  if(process.platform==="win32")spawn("taskkill",["/pid",String(child.pid),"/T","/F"],{stdio:"ignore"});
  else{try{process.kill(-child.pid,"SIGTERM");}catch{}}
 }
 setTimeout(()=>process.exit(code),700);
}
for(const [name,args] of [["backend",backend],["frontend",frontend]]){
 const env={...process.env};
 if(name==="backend"&&process.env.BACKEND_PORT)env.PORT=process.env.BACKEND_PORT;
 if(name==="frontend")env.PORT=process.env.FRONTEND_PORT||"3000";
 const child=spawn(process.execPath,args,{cwd:path.join(root,name),env,stdio:"inherit",detached:process.platform!=="win32"});
 children.push(child);child.on("error",error=>{console.error(name+": "+error.message);stop(1);});
 child.on("exit",code=>{if(!stopping)stop(code??1);});
}
process.on("SIGINT",()=>stop());process.on("SIGTERM",()=>stop());
