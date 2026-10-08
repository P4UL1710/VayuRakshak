"use client";
import Link from "next/link";
import {Route,Wind,CalendarDays,Flame,ArrowUpRight} from "lucide-react";
import {actions} from "@vayurakshak/shared/data/mock-air-data";
import {useApp} from "@/components/layout/AppProvider";
export function ActionTimeline(){const {approvals,deleted,rules}=useApp();const icons=[Route,Wind,CalendarDays,Flame];return <section className="card"><div className="card-header"><div><h2>What VayuRakshak is doing for you</h2><p>A little foresight. A lot more protection.</p></div><span className="badge green">AI agent</span></div>{deleted?<p className="muted">Restore the demo in Settings to prepare a personal action plan.</p>:<ul className="timeline-list">{actions.map((a,i)=>{const Icon=icons[i];const approved=i===1&&rules.purifier&&approvals.some(x=>x.ruleId==="purifier");return <li key={a.text}><div className="timeline-icon"><Icon size={15}/></div><Link href={a.href}>{a.text}</Link><span className={"badge "+(approved||i===0?"green":i===1?"amber":"")}>{approved?"Scheduled":a.status}</span><ArrowUpRight size={12} className="muted"/></li>;})}</ul>}</section>;}
