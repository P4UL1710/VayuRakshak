import {NextResponse} from "next/server";
import {proxyAgent} from "@/lib/server/backend";
import type {Profile} from "@vayurakshak/shared/types/user";
export async function POST(request:Request){
 if(request.headers.get("content-type")?.split(";")[0].trim()!=="application/json")return NextResponse.json({error:"Content-Type must be application/json"},{status:415});
 let body:unknown;
 try{
  // Limit the stream before parsing rather than trusting Content-Length.
  const reader=request.body?.getReader();if(!reader)throw new Error("Missing body");
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384){await reader.cancel();return NextResponse.json({error:"Request body too large"},{status:413});}chunks.push(value);}
  body=JSON.parse(Buffer.concat(chunks).toString("utf8"));
 }catch{return NextResponse.json({error:"Invalid JSON body"},{status:400});}
 if(!body||typeof body!=="object")return NextResponse.json({error:"A question and profile are required"},{status:400});
 const {question,profile="General"}=body as {question?:unknown;profile?:unknown};
 if(typeof question!=="string"||!question.trim()||question.length>500)return NextResponse.json({error:"Question must contain 1–500 characters"},{status:400});
 if(typeof profile!=="string"||!["General","Child","Asthma","Elderly","Fitness"].includes(profile))return NextResponse.json({error:"Unsupported profile"},{status:400});
 return proxyAgent(question.trim(),profile as Profile);
}
