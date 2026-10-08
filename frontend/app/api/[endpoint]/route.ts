import {NextResponse} from "next/server";
import {proxyRead,type ReadEndpoint} from "@/lib/server/backend";
export async function GET(_request:Request,{params}:{params:Promise<{endpoint:string}>}){
 const {endpoint}=await params;
 if(!["bootstrap","routes","fires","calendar","wearable"].includes(endpoint))return NextResponse.json({error:"Endpoint not found"},{status:404});
 return proxyRead(endpoint as ReadEndpoint);
}
