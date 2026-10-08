"use client";
import {useId} from "react";
import {Area,AreaChart,CartesianGrid,ReferenceLine,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {useApp} from "@/components/layout/AppProvider";
export function ForecastChart(){
 const id=useId().replaceAll(":","");
 const {data:{forecast}}=useApp();
 return <div><div className="chart-wrap" role="img" aria-label="Illustrative 72-hour AQI forecast. Tomorrow peaks at 286 around 9 AM; day 2 peaks at 262, day 3 at 205.">
 <ResponsiveContainer width="100%" height="100%"><AreaChart data={forecast} margin={{top:12,right:7,left:-20,bottom:0}}>
 <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F766E" stopOpacity={.18}/><stop offset="100%" stopColor="#0F766E" stopOpacity={.01}/></linearGradient></defs>
 <CartesianGrid stroke="#E7EEEA" vertical={false} strokeDasharray="3 3"/><XAxis dataKey="label" tick={{fontSize:8,fill:"#59706D"}} axisLine={false} tickLine={false} minTickGap={30}/>
 <YAxis domain={[100,350]} ticks={[100,200,300]} tick={{fontSize:9,fill:"#59706D"}} axisLine={false} tickLine={false}/>
 <Tooltip contentStyle={{borderRadius:10,borderColor:"#D9E6E4",fontSize:11}}/><ReferenceLine y={250} stroke="#D99869" strokeDasharray="4 4"/>
 <Area type="monotone" dataKey="aqi" name="Forecast AQI (demo)" stroke="#0F766E" strokeWidth={2.5} fill={"url(#"+id+")"} isAnimationActive={false}/>
 </AreaChart></ResponsiveContainer></div><div className="chart-foot"><div className="forecast-legend"><span><i className="legend-dot"/>Forecast AQI</span><span>— High exposure window</span></div><span>Confidence: <strong>Moderate</strong></span></div></div>;
}
