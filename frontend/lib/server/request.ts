export class InvalidRequest extends Error {}
export async function boundedJson(request:Request,maxBytes=8192):Promise<unknown>{
 if(!request.headers.get("content-type")?.startsWith("application/json"))throw new InvalidRequest("Send a JSON request.");
 const reader=request.body?.getReader();if(!reader)throw new InvalidRequest("Missing request body.");let size=0;const chunks:Uint8Array[]=[];
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>maxBytes){await reader.cancel();throw new InvalidRequest("Request body is too large.");}chunks.push(value);}
 return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function sameOrigin(request:Request){
 if(request.headers.get("sec-fetch-site")==="cross-site")return false;
 const origin=request.headers.get("origin");if(!origin)return true;
 // Next standalone can normalize request.url to localhost; preserve the real Host header.
 const expected=process.env.APP_ORIGIN||`${new URL(request.url).protocol}//${request.headers.get("host")||new URL(request.url).host}`;
 return origin===expected;
}
