"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Map, Route, Flame, HeartPulse, Wind, CalendarDays, Settings, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
export const navigation = [
 {href:"/dashboard",label:"Overview",icon:LayoutDashboard},{href:"/map",label:"Live Air Map",icon:Map},
 {href:"/routes",label:"Clean Routes",icon:Route},{href:"/fire-tracker",label:"Fire Tracker",icon:Flame},
 {href:"/health",label:"Health Insights",icon:HeartPulse},{href:"/automations",label:"Automations",icon:Wind},
 {href:"/calendar",label:"Calendar Guard",icon:CalendarDays},{href:"/settings",label:"Settings",icon:Settings},{href:"/architecture",label:"AWS Architecture",icon:ShieldCheck}
];
export function Brand(){return <Link href="/" className="brand" aria-label="VayuRakshak AI home"><span className="brand-mark"><ShieldCheck size={27}/></span><span>VAYURAKSHAK <b>AI</b><small>YOUR PERSONAL AIR GUARDIAN</small></span></Link>;}
export function Sidebar(){const path=usePathname();return <aside className="sidebar"><Brand/><p className="nav-caption">YOUR AIR, YOUR CONTROL</p><nav aria-label="Main navigation">{navigation.map(({href,label,icon:Icon})=><Link key={href} href={href} className={cn("nav-link",path===href&&"active")} aria-current={path===href?"page":undefined}><Icon size={20}/>{label}{path===href&&<span className="active-dot"/>}</Link>)}</nav><div className="sidebar-bottom"><div className="sidebar-promise"><ShieldCheck size={21}/><h4>Protection, with permission.</h4><p>Every action starts with you.</p><Link href="/settings">Your privacy controls <ArrowUpRight size={14}/></Link></div><div className="demo-label"><span className="live-dot"/> HACKATHON DEMO</div><p className="sidebar-fine">We don’t just inform. We protect.</p></div></aside>;}
