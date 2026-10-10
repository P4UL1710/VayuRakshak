import {randomBytes,scrypt,timingSafeEqual,createHash} from "node:crypto";
import {mkdir,readFile,writeFile,rename,open,unlink} from "node:fs/promises";
import path from "node:path";
import {promisify} from "node:util";
const derive=promisify(scrypt);
export const DEMO_ACCOUNT={email:"demo@vayurakshak.ai",password:"Breathe@123",name:"Pawan"};
export type AuthUser={id:string;email:string;name:string;demo:boolean};
type StoredUser=AuthUser & {salt:string;hash:string};
type Session={digest:string;userId:string;expires:number};
type Database={users:StoredUser[];sessions:Session[]};
const databasePath=()=>path.resolve(process.env.AUTH_DATA_DIR||path.join(process.cwd(),".runtime"),"accounts.json");
let pending:Promise<unknown>=Promise.resolve();
async function locked<T>(action:(db:Database)=>Promise<T>):Promise<T>{
 const task=pending.then(async()=>{
  const file=databasePath();await mkdir(path.dirname(file),{recursive:true});
  // Serialize mutations even when route bundles load separate module instances.
  const lockPath=file+".lock";let lock;const deadline=Date.now()+5000;
  while(!lock){try{lock=await open(lockPath,"wx",0o600);}catch(error){if((error as NodeJS.ErrnoException).code!=="EEXIST"||Date.now()>deadline)throw error;await new Promise(resolve=>setTimeout(resolve,20));}}
  try{let db:Database;
  try{db=JSON.parse(await readFile(file,"utf8"));if(!Array.isArray(db.users)||!Array.isArray(db.sessions))throw new Error("Invalid account database");}
  catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")throw error;const salt=randomBytes(16).toString("hex");const hash=(await derive(DEMO_ACCOUNT.password,salt,64) as Buffer).toString("hex");db={users:[{id:"demo-pawan",email:DEMO_ACCOUNT.email,name:DEMO_ACCOUNT.name,demo:true,salt,hash}],sessions:[]};}
  db.sessions=db.sessions.filter(session=>session.expires>Date.now());const result=await action(db);
  const temp=file+"."+randomBytes(6).toString("hex")+".tmp";await writeFile(temp,JSON.stringify(db),{mode:0o600});
  try{const renameDeadline=Date.now()+2000;while(true){try{await rename(temp,file);break;}catch(error){
   // Windows may briefly prevent replacement while another SSR request reads it.
   if(!["EPERM","EACCES","EBUSY"].includes((error as NodeJS.ErrnoException).code??"")||Date.now()>renameDeadline)throw error;
   await new Promise(resolve=>setTimeout(resolve,20));
  }}}finally{await unlink(temp).catch(()=>{});}return result;
  }finally{await lock.close();await unlink(lockPath);}
 });pending=task.catch(()=>{});return task;
}
const publicUser=({id,email,name,demo}:StoredUser):AuthUser=>({id,email,name,demo});
const digest=(token:string)=>createHash("sha256").update(token).digest("hex");
export function safeDestination(value:unknown){return typeof value==="string"&&/^\/(?!\/)[a-z0-9/?=#&._%-]*$/i.test(value)&&!value.startsWith("/login")?value:"/dashboard";}
export async function authenticate(email:string,password:string){return locked(async db=>{const user=db.users.find(user=>user.email===email.toLowerCase().trim());const salt=user?.salt??"00000000000000000000000000000000";const hash=await derive(password,salt,64) as Buffer;const expected=Buffer.from(user?.hash??"00".repeat(64),"hex");return user&&expected.length===hash.length&&timingSafeEqual(hash,expected)?publicUser(user):null;});}
export async function register(name:string,email:string,password:string){return locked(async db=>{const normalized=email.toLowerCase().trim();if(db.users.some(user=>user.email===normalized))return null;const salt=randomBytes(16).toString("hex");const hash=(await derive(password,salt,64) as Buffer).toString("hex");const user:StoredUser={id:randomBytes(16).toString("hex"),email:normalized,name:name.trim(),demo:false,salt,hash};db.users.push(user);return publicUser(user);});}
export async function createSession(user:AuthUser){return locked(async db=>{const token=randomBytes(32).toString("hex");db.sessions.push({digest:digest(token),userId:user.id,expires:Date.now()+7*24*60*60*1000});return token;});}
export async function findSession(token:string|undefined){if(!token||!/^[a-f0-9]{64}$/.test(token))return null;try{const db:Database=JSON.parse(await readFile(databasePath(),"utf8"));const session=db.sessions.find(session=>session.digest===digest(token)&&session.expires>Date.now());const user=session&&db.users.find(user=>user.id===session.userId);return user?publicUser(user):null;}catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return null;throw error;}}
export async function revokeSession(token:string|undefined){if(!token)return;await locked(async db=>{db.sessions=db.sessions.filter(session=>session.digest!==digest(token));});}
