"use client";
import {useState} from "react";
import Link from "next/link";
import {MapPin,Bell,ChevronDown,Menu,X} from "lucide-react";
import {navigation} from "./Sidebar";
import {useApp} from "./AppProvider";
export function Topbar(){
 const [menu,setMenu]=useState(false);const [notifications,setNotifications]=useState(false);
 const {preferences,deleted}=useApp();
 return <header className="topbar"><div><p className="top-greeting">Good evening, {deleted?"there":"Pawan"} <span>✦</span></p><p className="top-date">Your air protection, one step ahead.</p></div>
 <div className="topbar-actions"><label className="location-control"><MapPin size={16}/><select aria-label="Location"><option>Delhi-NCR · IIT Delhi area</option><option>Delhi-NCR · Connaught Place</option></select><ChevronDown size={13}/></label><button className="icon-button notification-button" aria-label="View notifications" aria-expanded={notifications} onClick={()=>setNotifications(!notifications)}><Bell size={20}/>{preferences.notifications&&<i/>}</button><Link href="/settings" className="avatar" aria-label="Open profile">P</Link><button className="icon-button mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button></div>
 {notifications&&<div className="notification-popover"><h3>Air protection updates</h3><p>{preferences.notifications?"Tomorrow’s morning forecast may raise exposure. Your purifier plan is awaiting approval.":"Notifications are paused in your preferences."}</p><Link href="/automations" onClick={()=>setNotifications(false)}>Review pending actions →</Link><small>Illustrative demo alerts</small></div>}
 {menu&&<nav className="mobile-drawer" aria-label="More pages">{navigation.map(n=><Link href={n.href} key={n.href} onClick={()=>setMenu(false)}><n.icon size={18}/>{n.label}</Link>)}</nav>}
 </header>;
}
