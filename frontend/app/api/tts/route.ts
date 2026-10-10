import {validateNarration,narrationRateAllowed,synthesizeNarration} from "@/lib/vayu-guide/tts/tts-service";
import {boundedJson,sameOrigin} from "@/lib/server/request";
export const runtime="nodejs";
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:"Cross-origin narration requests are blocked."},{status:403});
 if(!narrationRateAllowed())return Response.json({error:"Please wait before requesting more narration."},{status:429,headers:{"Retry-After":"60"}});
 try{
  if(Number(request.headers.get("content-length"))>8192)return Response.json({error:"Narration too long"},{status:413});
  let body:unknown;try{body=await boundedJson(request);}catch{return Response.json({error:"Invalid narration request"},{status:400});}const payload=validateNarration(body);if(!payload)return Response.json({error:"Narration must be public guide text, up to 1,500 characters, with an allowed voice and rate."},{status:400});
  if(!process.env.EDGE_TTS_URL)return Response.json({provider:"browser-fallback",message:"Edge TTS is not configured. Browser speech is available after explicit consent."});
  const bytes=await synthesizeNarration(payload);return new Response(new Uint8Array(bytes),{headers:{"Content-Type":"audio/mpeg","Cache-Control":"private, max-age=3600","X-Narration-Provider":"edge-tts"}});
 }catch{return Response.json({provider:"browser-fallback",message:"Audio narration is unavailable right now. You can continue reading the guide."},{status:503});}
}
