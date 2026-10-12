"use client";
import {createContext,useContext,useState,useEffect,useRef,type ReactNode} from "react";
import type {AirProofReport,PublicReport} from "@/lib/airproof/types";
import {mockAirProofReports} from "@/data/mock-airproof-reports";
import {checkPublish,publishProjection} from "@/lib/airproof/mock-airproof-service";
type Moderation={id:string;reportId:string;reason:string;at:string};
type State={reports:AirProofReport[];community:PublicReport[];moderation:Moderation[];save:(report:AirProofReport)=>void;publish:(report:AirProofReport)=>string|null;correct:(id:string,reason:string)=>void;support:(id:string,note:string)=>void;supportCount:(id:string)=>number;retainMedia:(url:string)=>void};
const Context=createContext<State|null>(null);
export function AirProofProvider({children}:{children:ReactNode}){
 const [reports,setReports]=useState<AirProofReport[]>([]);const [community,setCommunity]=useState(mockAirProofReports);const [moderation,setModeration]=useState<Moderation[]>([]);const [supporting,setSupporting]=useState<{reportId:string;note:string}[]>([]);const ownedUrls=useRef(new Set<string>());
 useEffect(()=>()=>{for(const url of ownedUrls.current)URL.revokeObjectURL(url);},[]);
 function save(report:AirProofReport){for(const media of report.media)if(media.url.startsWith("blob:"))ownedUrls.current.add(media.url);setReports(previous=>[report,...previous.filter(existing=>existing.id!==report.id)]);}
 function publish(report:AirProofReport){const error=checkPublish(report,reports,community);if(error)return error;const published={...report,status:"community_published" as const};const projection=publishProjection(published);if(!projection)return "This report needs your publishing confirmation.";save(published);setCommunity(previous=>[projection,...previous]);return null;}
 function correct(reportId:string,reason:string){setModeration(previous=>[...previous,{id:crypto.randomUUID(),reportId,reason,at:new Date().toISOString()}]);}
 function support(reportId:string,note:string){setSupporting(previous=>[...previous,{reportId,note}]);}
 return <Context.Provider value={{reports,community,moderation,save,publish,correct,support,supportCount:id=>supporting.filter(s=>s.reportId===id).length,retainMedia:url=>ownedUrls.current.add(url)}}>{children}</Context.Provider>;
}
export function useAirProof(){const context=useContext(Context);if(!context)throw new Error("AirProofProvider missing");return context;}
