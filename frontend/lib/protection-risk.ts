export type SensitivityProfile = "general" | "fitness" | "child" | "elderly" | "asthma";
export type VentilationRisk = "low" | "medium" | "high";
export type ProtectionRiskInput = {forecastAqi:number;peakDurationHours:number;indoorPm25?:number;minutesUntilOccupancy:number;sensitivity:SensitivityProfile;ventilationRisk:VentilationRisk};
const bound=(value:number,max:number)=>Number.isFinite(value)?Math.max(0,Math.min(max,value)):0;
export function calculateProtectionRisk(input:ProtectionRiskInput){
 const indoorAvailable=input.indoorPm25!==undefined&&Number.isFinite(input.indoorPm25)&&input.indoorPm25>=0;
 const factors=[
  {label:`Forecast AQI (${bound(input.forecastAqi,500)})`,weight:35,level:bound(input.forecastAqi,350)/350},
  {label:"Predicted spike duration",weight:15,level:bound(input.peakDurationHours,5)/5},
  {label:indoorAvailable?`Indoor PM2.5 (${input.indoorPm25} µg/m³)`:"Indoor PM2.5 unavailable — weight excluded",weight:indoorAvailable?25:0,level:indoorAvailable?bound(input.indoorPm25!,100)/100:0},
  {label:"Occupancy proximity",weight:10,level:1-bound(input.minutesUntilOccupancy,180)/180},
  {label:`${input.sensitivity} sensitivity preference`,weight:10,level:({general:.2,fitness:.5,child:.8,elderly:.8,asthma:1})[input.sensitivity]},
  {label:`Ventilation: ${input.ventilationRisk}`,weight:5,level:({low:.2,medium:.6,high:1})[input.ventilationRisk]},
 ];
 const availableWeight=factors.reduce((sum,f)=>sum+f.weight,0);
 const score=Math.round(factors.reduce((sum,f)=>sum+f.level*f.weight,0)*100/availableWeight);
 // Allocate whole points by largest remainder so the displayed breakdown always sums exactly.
 const breakdown=factors.map(f=>({...f,raw:f.weight*f.level*100/availableWeight,points:Math.floor(f.weight*f.level*100/availableWeight)}));
 const remainder=score-breakdown.reduce((sum,f)=>sum+f.points,0);
 [...breakdown].sort((a,b)=>(b.raw-b.points)-(a.raw-a.points)).slice(0,remainder).forEach(f=>f.points++);
 const band=score<30?"Low":score<60?"Elevated":score<80?"High":"Severe";
 const action=score<30?"Eco monitoring":score<60?"Suggest standard filtration":score<80?"Pre-start standard filtration":"Pre-start higher filtration and review indoor guidance";
 return {score,band,action,breakdown,indoorAvailable,availableWeight};
}
export const demoProtectionInput:ProtectionRiskInput={forecastAqi:286,peakDurationHours:3.5,indoorPm25:54,minutesUntilOccupancy:30,sensitivity:"asthma",ventilationRisk:"medium"};
