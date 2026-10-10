import type {TTSProvider,NarrationRequest} from "../types";
export class EdgeTTSProvider implements TTSProvider{
 async synthesize(request:NarrationRequest){
  const url=process.env.EDGE_TTS_URL;if(!url)throw new Error("Edge TTS is not configured");
  const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json",...(process.env.EDGE_TTS_TOKEN?{Authorization:`Bearer ${process.env.EDGE_TTS_TOKEN}`}:{})},body:JSON.stringify(request),signal:AbortSignal.timeout(15_000)});
  if(!response.ok||!response.headers.get("content-type")?.includes("audio/"))throw new Error("Edge narration unavailable");
  const data=new Uint8Array(await response.arrayBuffer());if(data.length>4_000_000)throw new Error("Audio too large");return data;
 }
}
