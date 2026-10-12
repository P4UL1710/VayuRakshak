"use client";
import Link from "next/link";
import {ArrowUpRight,ArrowRight,Clock,Wind,Droplets,Activity,MapPin,ShieldCheck,TriangleAlert} from "lucide-react";
import {useApp} from "@/components/layout/AppProvider";
import {AQIStatusBadge} from "@/components/ui/AQIStatusBadge";
import {AQIGauge} from "@/components/ui/AQIGauge";
import {AirPulseOrb} from "@/components/3d/AirPulseOrb";
import {ForecastChart} from "@/components/charts/ForecastChart";
import {ActionTimeline} from "@/components/dashboard/ActionTimeline";
import {ExposureScoreCard} from "@/components/dashboard/ExposureScoreCard";
import {AirMap} from "@/components/maps/AirMap";
import {AgentChatPreview} from "@/components/agent/AgentChatPreview";
import {TomorrowAirPlan} from "@/components/dashboard/TomorrowAirPlan";
import {EmptyState} from "@/components/ui/States";
import {AirProofDashboardCard} from "@/components/airproof/AirProofDashboard";
export default function Dashboard(){
 const {preferences,deleted,data:{current,tomorrow}}=useApp();
 return <div className="section-stack"><div className="dashboard-heading"><div><p className="eyebrow mb-1">YOUR DAILY AIR BRIEFING</p><h1>A clearer picture. A safer tomorrow.</h1><p>Know what’s coming. Choose how you’re protected.</p></div><span className="badge green"><ShieldCheck size={12}/>{preferences.personalized&&!deleted?preferences.profile+" profile":"General guidance"}</span></div>
 <section data-tour="dashboard-risk" id="forecast-risk" className="card hero-risk" aria-labelledby="risk-title"><div><p className="risk-kicker" id="risk-title"><TriangleAlert size={14}/>Tomorrow morning: High exposure risk</p><div className="risk-value"><div><div className="risk-number">{tomorrow.peakAqi}</div><p className="risk-unit">FORECAST AQI</p></div><AQIStatusBadge aqi={tomorrow.peakAqi}/></div><p className="risk-window"><Clock size={12}/>{tomorrow.window} · Forecast confidence: Moderate</p><p className="risk-recommendation">Leave at <strong>8:55 AM</strong> via the <strong>Balanced Route</strong> for <strong>28% lower estimated exposure</strong>. Indoor protection is ready for approval.</p><div className="hero-actions"><Link href="/routes?plan=balanced" className="button primary">View safer route <ArrowUpRight size={14}/></Link><Link href="/health" className="button secondary">Review protection plan <ArrowRight size={14}/></Link></div></div><div className="hero-visual"><AirPulseOrb aqi={286}/><p className="orb-caption">A little foresight goes a long way</p><div className="mini-trend"><svg viewBox="0 0 100 30" aria-hidden><path d="M0 28 Q12 17 22 20 T43 9 T63 7 T80 3 L100 9" fill="none" stroke="#DBB879" strokeWidth="2"/></svg><span>Morning peak</span></div></div></section>
 <TomorrowAirPlan/>
 <AirProofDashboardCard/>
 <div data-tour="forecast-chart" className="dashboard-data"><section className="card"><div className="card-header"><h2>Current conditions</h2><span className="badge">Demo reading</span></div><div className="conditions-number"><strong>{current.aqi}</strong><AQIStatusBadge aqi={current.aqi}/></div><p className="fine-print flex items-center gap-1"><MapPin size={11}/>IIT Delhi · Hauz Khas</p><AQIGauge aqi={current.aqi}/><dl className="condition-grid"><div><dt><Activity size={12}/>PM2.5</dt><dd>{current.pm25} µg/m³</dd></div><div><dt><Wind size={12}/>Wind · {current.windDir}</dt><dd>{current.windKmh} km/h</dd></div><div><dt><Droplets size={12}/>Humidity</dt><dd>{current.humidity}%</dd></div></dl><p className="updated"><span className="live-dot"/>Updated {current.updated}</p></section><section className="card"><div className="card-header"><div><h2>Your next 72 hours</h2><p>Morning and evening peaks, before they happen.</p></div><span className="badge">72-hour forecast</span></div><ForecastChart/></section></div>
 <div className="two-column"><ActionTimeline/>{deleted?<EmptyState title="Your personal exposure summary is cleared" description="Restore the demo scenario in Settings to explore Pawan’s exposure insights."/>:<ExposureScoreCard/>}</div>
 <div className="equal-columns"><section className="card"><div className="card-header"><div><h2>The air around you</h2><p>Delhi-NCR · Your commute in context</p></div><Link className="text-link" href="/map">Open map <ArrowUpRight size={13}/></Link></div><div className="mini-map"><AirMap/></div><div className="map-caption"><span><span className="live-dot"/>IIT Delhi → Connaught Place</span><span>Illustrative air layer</span></div><Link href="/map" className="button secondary w-full mt-4">Open live air map <ArrowUpRight size={14}/></Link></section><AgentChatPreview/></div>
 <div className="notice"><strong>About this demo:</strong> All readings, forecasts and exposure reductions are illustrative. Display categories follow the demo scenario, not official CPCB bands. External actions require approval and are simulated here.</div></div>;
}
