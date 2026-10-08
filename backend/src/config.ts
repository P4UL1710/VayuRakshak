export interface BackendConfig {
 port:number;host:string;corsOrigins:string[];dataMode:"demo";
 maxBodyBytes:number;requestTimeoutMs:number;shutdownTimeoutMs:number;
}
function positiveInteger(env:NodeJS.ProcessEnv,name:string,fallback:number,max:number){
 const raw=env[name];if(raw===undefined||raw==="")return fallback;
 const value=Number(raw);if(!Number.isInteger(value)||value<1||value>max)throw new Error(name+" must be an integer between 1 and "+max);
 return value;
}
export function readConfig(env:NodeJS.ProcessEnv=process.env):BackendConfig {
 if(env.DATA_MODE&&env.DATA_MODE!=="demo")throw new Error("DATA_MODE must be demo until live adapters are implemented");
 const corsOrigins=(env.CORS_ORIGINS??"http://localhost:3000,http://127.0.0.1:3000").split(",").map(s=>s.trim()).filter(Boolean);
 for(const origin of corsOrigins){const url=new URL(origin);if(!["http:","https:"].includes(url.protocol)||url.origin!==origin)throw new Error("CORS_ORIGINS must contain exact http(s) origins");}
 return {port:positiveInteger(env,"PORT",4000,65535),host:env.HOST||"0.0.0.0",corsOrigins,dataMode:"demo",
  maxBodyBytes:positiveInteger(env,"MAX_BODY_BYTES",16384,1048576),
  requestTimeoutMs:positiveInteger(env,"REQUEST_TIMEOUT_MS",10000,120000),
  shutdownTimeoutMs:positiveInteger(env,"SHUTDOWN_TIMEOUT_MS",10000,120000)};
}
