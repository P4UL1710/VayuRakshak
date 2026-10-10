"use client";
import {useState,useRef,useEffect,useCallback} from "react";
import {browserNarration} from "@/lib/vayu-guide/tts/providers/browser-fallback";
export function useNarration(){
 const [status,setStatus]=useState("Ready — optional narration");const [playing,setPlaying]=useState(false);const [paused,setPaused]=useState(false);
 const audio=useRef<HTMLAudioElement|null>(null);const objectUrl=useRef<string|null>(null);const generation=useRef(0);const controller=useRef<AbortController|null>(null);
 const stop=useCallback(()=>{generation.current++;controller.current?.abort();audio.current?.pause();audio.current=null;if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);objectUrl.current=null;if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();setPlaying(false);setPaused(false);},[]);
 useEffect(()=>()=>{generation.current++;controller.current?.abort();audio.current?.pause();if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);if("speechSynthesis" in window)window.speechSynthesis.cancel();},[]);
 async function listen(text:string,muted:boolean,rate=1){
  stop();if(muted){setStatus("Unmute Vayu to listen.");return;}const turn=generation.current;const publicText=text.slice(0,1500);setStatus("Preparing narration…");controller.current=new AbortController();
  try{
   const response=await fetch("/api/tts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:publicText,rate:`${rate<1?"-":"+"}${Math.round(Math.abs(rate-1)*100)}%`}),signal:controller.current.signal});
   if(generation.current!==turn)return;
   if(response.ok&&response.headers.get("content-type")?.includes("audio/")){
    const blob=await response.blob();if(generation.current!==turn)return;objectUrl.current=URL.createObjectURL(blob);audio.current=new Audio(objectUrl.current);audio.current.onended=()=>{if(generation.current===turn)setPlaying(false);};audio.current.onerror=()=>{if(generation.current===turn){setStatus("Audio narration is unavailable right now. You can continue reading the guide.");setPlaying(false);}};await audio.current.play();if(generation.current!==turn)return;setStatus("Edge TTS narration");setPlaying(true);return;
   }
   if(response.status===400||response.status===429){setStatus("Narration unavailable for this response. You can continue reading the guide.");return;}
  }catch{if(generation.current!==turn)return;}
  if(generation.current!==turn)return;
  setStatus("Browser speech fallback — may use your browser’s speech service");setPlaying(true);
  browserNarration(publicText,()=>{if(generation.current===turn)setPlaying(false);},()=>{if(generation.current===turn){setPlaying(false);setStatus("Audio narration is unavailable right now. You can continue reading the guide.");}},rate);
 }
 function pauseResume(){if(audio.current){if(paused)void audio.current.play();else audio.current.pause();}else if("speechSynthesis" in window){if(paused)window.speechSynthesis.resume();else window.speechSynthesis.pause();}setPaused(!paused);}
 return {status,playing,paused,listen,stop,pauseResume};
}
export type NarrationController=ReturnType<typeof useNarration>;
export function VayuNarrationControls({text,muted,narration}:{text:string;muted:boolean;narration:NarrationController}){const [speed,setSpeed]=useState(1);return <div className="narration-controls"><div className="flex gap-2 flex-wrap"><button className="button secondary small-button" disabled={muted} onClick={()=>void narration.listen(text,muted,speed)}>Listen</button>{narration.playing&&<button className="button secondary small-button" onClick={narration.pauseResume}>{narration.paused?"Resume":"Pause narration"}</button>}<button className="button ghost small-button" disabled={muted} onClick={()=>void narration.listen(text,muted,speed)}>Replay narration</button><button className="button ghost small-button" onClick={narration.stop}>Stop</button><select aria-label="Narration speed" value={speed} onChange={event=>{narration.stop();setSpeed(Number(event.target.value));}}><option value={.9}>0.9×</option><option value={1}>1×</option><option value={1.15}>1.15×</option></select></div><p className="fine-print" role="status">{narration.status}</p>{text.length>1500&&<p className="fine-print">Audio reads the first 1,500 characters. The complete explanation is available below.</p>}</div>;}
