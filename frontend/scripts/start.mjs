import {cpSync,existsSync,mkdirSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {pathToFileURL} from "node:url";
const frontend=fileURLToPath(new URL("../",import.meta.url));
const standalone=path.join(frontend,".next/standalone/frontend");
const server=path.join(standalone,"server.js");
if(!existsSync(server))throw new Error("Build the frontend first: npm run build:frontend from the repository root.");
mkdirSync(path.join(standalone,".next"),{recursive:true});
cpSync(path.join(frontend,".next/static"),path.join(standalone,".next/static"),{recursive:true});
if(existsSync(path.join(frontend,"public")))cpSync(path.join(frontend,"public"),path.join(standalone,"public"),{recursive:true});
if(existsSync(path.join(frontend,".env.local")))process.loadEnvFile(path.join(frontend,".env.local"));
// Keep registrations across builds; standalone changes cwd into the disposable .next tree.
process.env.AUTH_DATA_DIR=process.env.AUTH_DATA_DIR||path.join(frontend,".runtime");
process.env.HOSTNAME=process.env.FRONTEND_HOST||"0.0.0.0";
await import(pathToFileURL(server).href);
