import {safeText} from "./privacy-utils";
export function downloadText(name:string,text:string,type="text/plain;charset=utf-8"){const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement("a");link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function indiaLocalInput(now=new Date()){const shifted=new Date(now.getTime()+330*60000);return shifted.toISOString().slice(0,16);}
export function observedIso(input:string){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input))return "";const time=new Date(`${input}:00+05:30`);return Number.isFinite(time.getTime())?time.toISOString():"";}
export function sanitizeDraft(text:string){return safeText(text,12000);}
