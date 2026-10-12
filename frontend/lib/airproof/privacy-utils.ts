import type {AirProofReport,PublicReport} from "./types";
export const areas=[{name:"Hauz Khas",latitude:28.55,longitude:77.21},{name:"Outer Ring Road",latitude:28.57,longitude:77.23},{name:"Green Park",latitude:28.57,longitude:77.21}];
export function approximateCell(latitude:number,longitude:number){return {latitude:Number((Math.floor(latitude/.02)*.02+.01).toFixed(2)),longitude:Number((Math.floor(longitude/.02)*.02+.01).toFixed(2))};}
export function publicProjection(report:AirProofReport):PublicReport|null{
 if(report.visibility!=="community_approximate"||!report.userConfirmation||!["community_published","closed"].includes(report.status))return null;
 const cell=typeof report.location.latitude==="number"&&typeof report.location.longitude==="number"?approximateCell(report.location.latitude,report.location.longitude):null;
 // Public output is an allowlist: no free text, reporter, exact address or uploaded media.
 const area=areas.some(a=>a.name===report.location.approximateArea)?report.location.approximateArea:"Approximate area";
 return {id:report.id,category:report.category,observedAt:report.observedAt,area,latitude:cell?.latitude,longitude:cell?.longitude,quality:report.evidenceQuality,status:report.status==="closed"?"closed":"community_published",demo:!!report.demo};
}
export function safeText(text:string,max=2000){return text.replace(/<[^>]*>/g,"").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"").slice(0,max).trim();}
export function escapeHtml(text:string){return text.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]!));}
