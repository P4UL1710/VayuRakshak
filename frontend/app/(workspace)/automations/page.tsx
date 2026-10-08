"use client";
import {useState} from "react";
import {ShieldCheck,History,Check} from "lucide-react";
import {useApp} from "@/components/layout/AppProvider";
import {automationRules} from "@vayurakshak/shared/data/mock-user-data";
import {AutomationRuleCard} from "@/components/automations/AutomationRuleCard";
import {PrivacyConsentModal} from "@/components/ui/PrivacyConsentModal";
import {EmptyState} from "@/components/ui/States";
import {ProtectionAutopilot,AutomationAuditTimeline} from "@/components/automations/ProtectionAutopilot";
export default function Automations(){
 const {rules,setRule,approvals,approve,toast,preferences}=useApp();const [pending,setPending]=useState<string|null>(null);const rule=automationRules.find(r=>r.id===pending);
 const descriptions:Record<string,string>={purifier:"Allow VayuRakshak to activate your Bedroom Purifier at 6:30 AM tomorrow because AQI is forecast to exceed 200?",windows:"Allow VayuRakshak to prepare a close-windows recommendation when outdoor PM2.5 rises sharply? No message will be sent in this demo.",arrival:"Allow VayuRakshak to prepare an arrival rule to start the Living-room Purifier when you are within 1 km of home? Location and device control are simulated.",severe:"Allow VayuRakshak to prepare a severe-air protection plan and pause outdoor-activity reminders when AQI exceeds 350? Notifications and reminder changes are simulated."};
 return <div className="section-stack"><div className="page-heading"><div><p className="eyebrow">A THOUGHTFUL HOME. A PROTECTED DAY.</p><h1>Automations that protect you—with your permission.</h1><p>VayuRakshak only runs an automation after you explicitly approve it. You can disable any rule at any time.</p></div></div><div className="notice flex gap-3 items-center"><ShieldCheck size={21} className="text-teal"/><span><strong>Ready is not running.</strong> The initial “On” switches indicate prepared rules. Every activation is awaiting approval. This demo controls no actual devices.</span></div>
 {!preferences.services.Purifier&&<EmptyState title="No smart purifier connected" description="Connect a smart purifier to enable pre-start protection."/>}
 <ProtectionAutopilot onApprove={()=>setPending("purifier")}/>
 <div className="equal-columns">{automationRules.map(r=>{const approval=[...approvals].reverse().find(a=>a.ruleId===r.id);return <AutomationRuleCard key={r.id} rule={r} enabled={rules[r.id]??false} scheduled={!!approval&&!!rules[r.id]} scope={approval?.scope} disabled={(r.id==="purifier"||r.id==="arrival")&&!preferences.services.Purifier} onToggle={()=>{if(rules[r.id]){setRule(r.id,false);toast(r.name+" paused. Demo schedule is inactive.");}else setPending(r.id);}} onRun={()=>setPending(r.id)}/>;})}</div>
 <AutomationAuditTimeline/>
 <section className="card"><div className="card-header"><h2 className="flex gap-2 items-center"><History size={18}/>Your approval history</h2><span className="badge">This session</span></div>{approvals.length===0?<p className="text-xs text-secondary">No actions approved yet. You’re in control.</p>:<ul className="timeline-list">{[...approvals].reverse().map(a=><li key={a.id}><Check size={16} className="text-teal"/><span className="text-xs flex-1">{automationRules.find(r=>r.id===a.ruleId)?.name} · {a.scope==="always"?"Standing rule permission":"Allowed once"}</span><span className="badge">{rules[a.ruleId]?"Simulated":"Paused"}</span></li>)}</ul>}</section>
 {rule&&<PrivacyConsentModal title={rule.id==="purifier"?"Approve purifier pre-start?":"Approve "+rule.name+"?"} description={descriptions[rule.id]} allowAlways onCancel={()=>setPending(null)} onConfirm={scope=>{approve(rule.id,scope);setRule(rule.id,true);setPending(null);if(rule.id!=="purifier")toast("Demo: "+rule.name+" approved and prepared.");}}/>}</div>;
}
