import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {readConfig} from "./config";
import {createApp} from "./app";
// Same relative location in src/ (dev) and dist/ (production).
const envFile=fileURLToPath(new URL("../.env",import.meta.url));
if(existsSync(envFile))process.loadEnvFile(envFile);
const config=readConfig();
const server=createApp(config);
server.on("error",error=>{console.error("Backend startup failed:",error.message);process.exitCode=1;});
server.listen(config.port,config.host,()=>console.log("VayuRakshak API ready on port "+config.port+" · "+config.dataMode+" mode"));
let shuttingDown=false;
function shutdown(){
 if(shuttingDown)return;shuttingDown=true;
 const timer=setTimeout(()=>{server.closeAllConnections();process.exit(1);},config.shutdownTimeoutMs);timer.unref();
 server.close(()=>{clearTimeout(timer);process.exit(0);});server.closeIdleConnections();
}
process.on("SIGTERM",shutdown);process.on("SIGINT",shutdown);
