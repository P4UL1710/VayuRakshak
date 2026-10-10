"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {createDemoSnapshot,isBootstrapResponse,type DemoSnapshot} from "@vayurakshak/shared/snapshot";
import { defaultPreferences, automationRules } from "@vayurakshak/shared/data/mock-user-data";
import type { Preferences } from "@vayurakshak/shared/types/user";
import type { ApprovalRecord } from "@vayurakshak/shared/types/automation";
import {mockProtectionWorkflow,morningPolicy,type ProtectionSchedule,type ProtectionPolicy} from "@/lib/aws-mock-services";
import {calculateProtectionRisk,demoProtectionInput} from "@/lib/protection-risk";
import type {AuthUser} from "@/lib/auth/store";
type AppState = {
 user:AuthUser|null;
 data:DemoSnapshot; dataStatus:"loading"|"connected"|"fallback"|"error";
 preferences: Preferences; setPreferences: (value: Preferences) => void;
 rules: Record<string, boolean>; setRule: (id:string,value:boolean) => void;
 approvals: ApprovalRecord[]; approve: (ruleId:string,scope:"once"|"always")=>void;
 calendarSuggestion: string | null; setCalendarSuggestion:(value:string|null)=>void;
 selectedRoute:string; setSelectedRoute:(value:string)=>void;
 deleted:boolean; deleteData:()=>void; restore:()=>void;
 toast:(value:string)=>void;
 schedules:ProtectionSchedule[];policy:ProtectionPolicy;setPolicy:(value:ProtectionPolicy)=>void;
 protectionMode:"recommend"|"ask"|"autopilot";setProtectionMode:(value:"recommend"|"ask"|"autopilot")=>void;
};
const Context = createContext<AppState | null>(null);
export function AppProvider({children,user=null}:{children:ReactNode;user?:AuthUser|null}) {
 const [data,setData]=useState<DemoSnapshot>(createDemoSnapshot);
 const [dataStatus,setDataStatus]=useState<AppState["dataStatus"]>("loading");
 useEffect(()=>{
  if(!user)return;
  const controller=new AbortController();
  fetch("/api/bootstrap",{signal:controller.signal,cache:"no-store"}).then(async response=>{
   if(!response.ok)throw new Error("Air service unavailable");
   const payload:unknown=await response.json();if(!isBootstrapResponse(payload))throw new Error("Invalid air data");
   setData(payload.data);setDataStatus(payload.backendAvailable?"connected":"fallback");
  }).catch(()=>{if(!controller.signal.aborted)setDataStatus("error");});
  return()=>controller.abort();
 },[user]);
 const [preferences,setPreferences]=useState<Preferences>(defaultPreferences);
 const [rules,setRules]=useState<Record<string,boolean>>(Object.fromEntries(automationRules.map(r=>[r.id,r.enabled])));
 const [approvals,setApprovals]=useState<ApprovalRecord[]>([]);
 const [calendarSuggestion,setCalendarSuggestion]=useState<string|null>(null);
 const [selectedRoute,setSelectedRoute]=useState("balanced");
 const [deleted,setDeleted]=useState(false);
 const [message,setMessage]=useState("");
 const [schedules,setSchedules]=useState<ProtectionSchedule[]>([]);
 const [policy,setPolicy]=useState<ProtectionPolicy>(morningPolicy);
 const [protectionMode,setProtectionMode]=useState<AppState["protectionMode"]>("ask");
 function setRule(id:string,value:boolean){
  setRules(r=>({...r,[id]:value}));
  if(id==="purifier"&&!value){setSchedules(s=>s.map(x=>x.status==="scheduled"?mockProtectionWorkflow.cancel(x):x));setPolicy(p=>({...p,enabled:false}));}
 }
 function approve(ruleId:string,scope:"once"|"always"){
  if(ruleId==="purifier"&&protectionMode==="recommend"){toast("Recommend mode is active. Choose Ask Every Time to approve a schedule.");return;}
  if((ruleId==="purifier"||ruleId==="arrival")&&!preferences.services.Purifier){toast("Connect a purifier before approving a device plan.");return;}
  const approval:ApprovalRecord={id:crypto.randomUUID(),ruleId,scope,approvedAt:new Date().toISOString(),status:"scheduled-demo"};
  if(ruleId==="purifier"){
   const sensitivity=preferences.personalized?preferences.profile.toLowerCase() as typeof demoProtectionInput.sensitivity:"general";
   const score=calculateProtectionRisk({...demoProtectionInput,sensitivity}).score;
   if(score<policy.trigger.riskScoreGte||score<60){toast("Protection risk is below the approved threshold. No schedule created.");return;}
   setSchedules(s=>[...s.map(x=>x.status==="scheduled"?mockProtectionWorkflow.cancel(x):x),mockProtectionWorkflow.schedule(approval,score,preferences.notifications&&preferences.services["Telegram / WhatsApp"])]);
   if(scope==="always"){setPolicy(p=>({...p,enabled:true}));setProtectionMode("autopilot");}
   toast("Purifier pre-start scheduled for tomorrow at 6:30 AM.");
  }
  setRules(r=>({...r,[ruleId]:true}));setApprovals(a=>[...a,approval]);
 }
 function toast(value:string) { setMessage(value); }
 function deleteData() {
  setSchedules([]);setPolicy(morningPolicy);setProtectionMode("ask");
  setApprovals([]); setCalendarSuggestion(null); setSelectedRoute("balanced");
  setPreferences({...defaultPreferences,personalized:false,notifications:false,services:{"Calendar":false,"Wearable":false,"Purifier":false,"Telegram / WhatsApp":false}});
  setRules(Object.fromEntries(automationRules.map(r=>[r.id,false]))); setDeleted(true); toast("Personal demo data cleared for this session.");
 }
 function restore(){setSchedules([]);setPolicy(morningPolicy);setProtectionMode("ask");setPreferences(defaultPreferences);setRules(Object.fromEntries(automationRules.map(r=>[r.id,r.enabled])));setApprovals([]);setCalendarSuggestion(null);setSelectedRoute("balanced");setDeleted(false);toast("Demo scenario restored. Actions are awaiting approval.");}
 return <Context.Provider value={{user,data,dataStatus,preferences,setPreferences,rules,setRule,approvals,approve,calendarSuggestion,setCalendarSuggestion,selectedRoute,setSelectedRoute,deleted,deleteData,restore,toast,schedules,policy,setPolicy,protectionMode,setProtectionMode}}>
 {children}{message && <div className="toast" role="status"><span>{message}</span><button aria-label="Dismiss notification" onClick={()=>setMessage("")}>×</button></div>}
 </Context.Provider>;
}
export function useApp() { const context=useContext(Context); if(!context) throw new Error("AppProvider missing"); return context; }
