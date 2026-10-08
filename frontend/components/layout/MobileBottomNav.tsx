"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {LayoutDashboard,Map,Route,Bot,UserRound} from "lucide-react";
const links=[{href:"/dashboard",label:"Home",icon:LayoutDashboard},{href:"/map",label:"Map",icon:Map},{href:"/routes",label:"Routes",icon:Route},{href:"/agent",label:"Agent",icon:Bot},{href:"/settings",label:"Profile",icon:UserRound}];
export function MobileBottomNav(){const path=usePathname();return <nav className="bottom-nav" aria-label="Mobile navigation">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={path===href?"page":undefined} className={path===href?"active":""}><Icon size={20}/><span>{label}</span></Link>)}</nav>;}
