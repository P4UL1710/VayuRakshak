"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {MapPin,Bell,ChevronDown,Menu,X,LogOut} from "lucide-react";
import {navigation} from "./Sidebar";
import {useApp} from "./AppProvider";
export function Topbar(){
 const [menu,setMenu]=useState(false);const [notifications,setNotifications]=useState(false);
 const [hydrated,setHydrated]=useState(false);useEffect(()=>{queueMicrotask(()=>setHydrated(true));},[]);
 const {preferences,deleted,user,schedules,toast}=useApp();const [signingOut,setSigningOut]=useState(false);
 async function logout(){setSigningOut(true);try{const response=await fetch("/api/auth/logout",{method:"POST"});if(!response.ok)throw new Error("Sign out failed");window.location.assign(new URL("/login",window.location.origin).href);}catch{setSigningOut(false);toast("Unable to sign out. Please try again.");}}
 return <header className="topbar"><div><p className="top-greeting">Welcome, {deleted?"there":user?.name.split(" ")[0]??"Pawan"} <span>✦</span></p><p className="top-date">{user?.demo?"Demo account · ":""}Your air protection, one step ahead.</p></div>
 <div className="topbar-actions"><label className="location-control"><MapPin size={16}/><select aria-label="Location"><option>Delhi-NCR · IIT Delhi area</option><option>Delhi-NCR · Connaught Place</option></select><ChevronDown size={13}/></label><button className="icon-button notification-button" aria-label="View notifications" aria-expanded={notifications} onClick={()=>setNotifications(!notifications)}><Bell size={20}/>{preferences.notifications&&<i/>}</button><Link href="/settings" className="avatar" aria-label="Open profile">P</Link><button className="icon-button mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button></div>
 <button className="icon-button signout-button" aria-label="Sign out" title="Sign out" disabled={!hydrated||signingOut} onClick={()=>void logout()}><LogOut size={18}/></button>
 {notifications&&<div className="notification-popover"><h3>Air protection updates</h3><p>{preferences.notifications?schedules.some(s=>s.status==="scheduled")?"Bedroom Purifier is scheduled for 6:30 AM tomorrow. You can review or pause it anytime.":"Tomorrow’s morning forecast may raise exposure. Your purifier plan is awaiting approval.":"Notifications are paused in your preferences."}</p><Link href="/automations" onClick={()=>setNotifications(false)}>Review protection actions →</Link><small>Illustrative demo alerts</small></div>}
 {menu&&<nav className="mobile-drawer" aria-label="More pages">{navigation.map(n=><Link href={n.href} key={n.href} onClick={()=>setMenu(false)}><n.icon size={18}/>{n.label}</Link>)}</nav>}
 </header>;
}
