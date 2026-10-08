"use client";
import {useState} from "react";
import Link from "next/link";
import {Bot,Send,ShieldCheck} from "lucide-react";
import {PrivacyConsentModal} from "@/components/ui/PrivacyConsentModal";
import {useApp} from "@/components/layout/AppProvider";
const initial=[{role:"user",text:"AQI near IIT Delhi?"},{role:"agent",text:"Current AQI is 218 — Poor in this demo. PM2.5 is elevated. Tomorrow morning’s commute has a higher estimated exposure risk."},{role:"user",text:"What should I do?"},{role:"agent",text:"Leave at 8:55 AM and use the Balanced Route. This may reduce estimated exposure by 28%. Your purifier plan is ready for approval."}];
export function AgentChatPreview({expanded=false}:{expanded?:boolean}){
 const {approve,setRule,toast,preferences,deleted}=useApp();const [messages,setMessages]=useState(initial);const [input,setInput]=useState("");const [consent,setConsent]=useState(false);const [pending,setPending]=useState(false);
 async function send(e:React.FormEvent){
  e.preventDefault();if(!input.trim()||pending)return;const question=input.trim();
  setMessages(m=>[...m,{role:"user",text:question}]);setInput("");setPending(true);
  try{const response=await fetch("/api/agent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,profile:preferences.personalized?preferences.profile:"General"}),signal:AbortSignal.timeout(9000)});
   if(!response.ok)throw new Error("Assistant unavailable");const result=await response.json();if(typeof result.text!=="string")throw new Error("Invalid assistant reply");
   setMessages(m=>[...m,{role:"agent",text:result.text+(result.backendAvailable===false?" (Offline demo reply.)":"")}]);
  }catch{setMessages(m=>[...m,{role:"agent",text:"The assistant is temporarily unavailable. Please try again, or review your route and protection plan directly."}]);}
  finally{setPending(false);}
 }
 return <section className="card agent-card" id="agent-chat"><div className="flex justify-between items-center"><div className="agent-heading"><div className="icon-tile"><Bot size={22}/></div><div><h2>Your air guardian</h2><p><span className="live-dot"/> Here to help you act</p></div></div><span className="badge green">Demo assistant</span></div>
 <div className="chat-messages" style={expanded?{maxHeight:560}:undefined} role="log" aria-label="Air guardian conversation" aria-live="polite">{(deleted?messages.slice(0,2):messages).map((m,i)=><div key={i} className={"chat-message "+(m.role==="user"?"user":"")}><small>{m.role==="user"?"YOU":"VAYURAKSHAK AI"}</small>{m.text}</div>)}</div>
 <div className="quick-actions"><Link className="button secondary" href="/routes">View route ↗</Link><button className="button secondary" disabled={!preferences.services.Purifier} onClick={()=>setConsent(true)}>Approve purifier plan</button><Link href="/health" className="button secondary">See protection plan</Link></div>
 <form className="chat-form" onSubmit={send}><input aria-label="Ask your air guardian" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about your air, routes or plan…" maxLength={500} disabled={pending}/><button className="icon-button" type="submit" aria-label="Send question" disabled={!input.trim()||pending}><Send size={16}/></button></form>{pending&&<p role="status" className="fine-print mt-2">Preparing your demo reply…</p>}
 <p className="fine-print mt-3 flex items-center gap-1.5"><ShieldCheck size={11}/> Suggestions first. Your approval, always.</p>
 {consent&&<PrivacyConsentModal title="Approve purifier pre-start?" description="Allow VayuRakshak to activate your Bedroom Purifier at 6:30 AM tomorrow because AQI is forecast to exceed 200?" allowAlways onCancel={()=>setConsent(false)} onConfirm={scope=>{approve("purifier",scope);setRule("purifier",true);setConsent(false);toast("Demo: Scheduled for tomorrow at 6:30 AM.");}}/>}</section>;
}
