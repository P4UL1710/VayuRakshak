import {createHash} from "node:crypto";
import {EdgeTTSProvider} from "./providers/edge-tts";
import {knowledgeDocuments} from "../rag/knowledge-loader";
import {fullTour} from "../tour-config";
import type {NarrationRequest} from "./types";
const cache=new Map<string,Uint8Array>();let windowStart=Date.now();let calls=0;
export function validateNarration(body:unknown):NarrationRequest|null{
 if(!body||typeof body!=="object")return null;const b=body as Record<string,unknown>;
 if(typeof b.text!=="string"||b.text.length>1500)return null;
 const text=b.text.replace(/<[^>]*>/g,"").trim();
 // Only public curated website/tour text can leave the server. Chat input and personal details cannot.
 const known=[...knowledgeDocuments.map(d=>d.text),...fullTour.map(s=>s.text)];
 if(text.length<5||!known.some(source=>source.includes(text)))return null;
 const voice=typeof b.voice==="string"?b.voice:"en-IN-NeerjaNeural";const rate=typeof b.rate==="string"?b.rate:"+0%";const pitch=typeof b.pitch==="string"?b.pitch:"+0Hz";
 if(!["en-IN-NeerjaNeural","en-IN-PrabhatNeural","en-US-AriaNeural"].includes(voice)||!/^[-+]\d{1,2}%$/.test(rate)||!/^[-+]\d{1,2}Hz$/.test(pitch))return null;
 return {text,voice,rate,pitch};
}
export function narrationRateAllowed(){if(Date.now()-windowStart>60_000){windowStart=Date.now();calls=0;}return ++calls<=30;}
export async function synthesizeNarration(request:NarrationRequest){const key=createHash("sha256").update(JSON.stringify(request)).digest("hex");const existing=cache.get(key);if(existing)return existing;const data=await new EdgeTTSProvider().synthesize(request);if(cache.size>=40)cache.delete(cache.keys().next().value!);cache.set(key,data);return data;}
