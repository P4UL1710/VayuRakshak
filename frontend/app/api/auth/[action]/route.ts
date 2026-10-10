import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {authenticate,register,createSession,revokeSession,DEMO_ACCOUNT} from "@/lib/auth/store";
import {SESSION_COOKIE,getSessionUser} from "@/lib/auth/session";
import {boundedJson,sameOrigin,InvalidRequest} from "@/lib/server/request";
export const runtime="nodejs";
const attempts=new Map<string,{count:number;reset:number}>();
function allowed(key:string){const now=Date.now();for(const [key,value] of attempts)if(value.reset<=now)attempts.delete(key);if(attempts.size>1000)return false;const entry=attempts.get(key)??{count:0,reset:now+60_000};entry.count++;attempts.set(key,entry);return entry.count<=12;}
export async function GET(_request:Request,{params}:{params:Promise<{action:string}>}){if((await params).action!=="session")return NextResponse.json({error:"Not found"},{status:404});return NextResponse.json({user:await getSessionUser()},{headers:{"Cache-Control":"no-store"}});}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 if(!sameOrigin(request))return NextResponse.json({error:"Cross-origin account requests are blocked."},{status:403});
 const {action}=await params;const jar=await cookies();
 if(action==="logout"){await revokeSession(jar.get(SESSION_COOKIE)?.value);jar.delete(SESSION_COOKIE);return NextResponse.json({ok:true});}
 if(!["login","register","demo"].includes(action))return NextResponse.json({error:"Not found"},{status:404});
 try{
  const body=action==="demo"?DEMO_ACCOUNT:await boundedJson(request);if(!body||typeof body!=="object")throw new InvalidRequest("Invalid account request.");
  const {email,password,name}=body as {email:unknown;password:unknown;name?:unknown};
  if(typeof email!=="string"||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||typeof password!=="string"||password.length<8||password.length>128)throw new InvalidRequest("Enter a valid email and a password with 8–128 characters.");
  if(!allowed(email.toLowerCase().trim()))return NextResponse.json({error:"Too many attempts. Please try again in a minute."},{status:429});
  if(action==="register"&&(typeof name!=="string"||name.trim().length<2||name.trim().length>60))throw new InvalidRequest("Use a name with 2–60 characters.");
  const user=action==="register"?await register(name as string,email,password):await authenticate(email,password);
  if(!user)return NextResponse.json({error:action==="register"?"Unable to create this account. Try signing in.":"Email or password is incorrect."},{status:action==="register"?409:401});
  await revokeSession(jar.get(SESSION_COOKIE)?.value);const token=await createSession(user);
  jar.set(SESSION_COOKIE,token,{httpOnly:true,sameSite:"lax",secure:new URL(process.env.APP_ORIGIN||request.url).protocol==="https:",path:"/",maxAge:7*24*60*60});
  return NextResponse.json({user},{headers:{"Cache-Control":"no-store"}});
 }catch(error){if(error instanceof SyntaxError||error instanceof InvalidRequest)return NextResponse.json({error:"Check your details and submit a valid account request."},{status:400});return NextResponse.json({error:"Account service unavailable. Please try again."},{status:503});}
}
