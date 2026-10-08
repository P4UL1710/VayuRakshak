"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import {AirGlobeFallback} from "./AirGlobeFallback";
import {AQIStatusBadge} from "@/components/ui/AQIStatusBadge";
const GlobeScene=dynamic(()=>import("./GlobeScene"),{ssr:false,loading:()=> <AirGlobeFallback/>});
class GlobeBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<AirGlobeFallback/>:this.props.children;}}
export function AirIntelligenceGlobe(){
 const [mode,setMode]=useState<"fallback"|"3d"|"still">("fallback");
 useEffect(()=>{
  const small=window.matchMedia("(max-width: 767px)");const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  function update(){let supported=false;try{const canvas=document.createElement("canvas");const gl=canvas.getContext("webgl2")||canvas.getContext("webgl");supported=!!gl;gl?.getExtension("WEBGL_lose_context")?.loseContext();}catch{}setMode(small.matches||!supported?"fallback":reduced.matches?"still":"3d");}
  update();small.addEventListener("change",update);reduced.addEventListener("change",update);return()=>{small.removeEventListener("change",update);reduced.removeEventListener("change",update);};
 },[]);
 return <figure className="globe-figure"><span className="globe-corner">AIR INTELLIGENCE · DELHI-NCR</span><GlobeBoundary>{mode==="fallback"?<AirGlobeFallback/>:<GlobeScene still={mode==="still"}/>}</GlobeBoundary><span className="globe-corner bottom">ILLUSTRATIVE ATMOSPHERIC MODEL</span><div className="globe-label"><p><span className="live-dot"/>Delhi-NCR · Demo</p><strong>AQI 218</strong><AQIStatusBadge aqi={218}/><p className="mt-1">Poor air quality</p></div><figcaption className="sr-only">Illustrative Delhi-NCR air-quality globe. Current AQI is 218, categorized as Poor in this demo.</figcaption></figure>;
}
