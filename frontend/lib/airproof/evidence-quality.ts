import type {EvidenceQuality} from "./types";
export type EvidenceInput={mediaCount:number;locationPresent:boolean;observedAt:string;description:string;validImage:boolean;brightness?:number;similarReports:number;confirmed:boolean;duplicate:boolean;exactPublicLocation?:boolean};
export function scoreEvidence(input:EvidenceInput):EvidenceQuality{
 let score=0;const reasons:string[]=[];const warnings:string[]=[];const add=(points:number,label:string)=>{score+=points;reasons.push(`+${points} · ${label}`);};
 if(input.mediaCount>0)add(30,"Supporting media attached");else warnings.push("No media attached. A written observation can still be saved.");
 if(input.locationPresent)add(20,"Approximate location available");else warnings.push("Add an approximate location.");
 if(Number.isFinite(Date.parse(input.observedAt)))add(15,"Timestamp recorded");else warnings.push("Confirm the observation time.");
 if(input.description.trim().length>=30)add(10,"Useful description added");else warnings.push("Add a short factual description if safe.");
 if(input.validImage){add(10,"Valid image and dimensions checked");if(input.brightness!==undefined&&input.brightness<45)warnings.push("Low-light image detected. Add context if safe; this is a brightness proxy.");}
 if(input.similarReports>0)add(10,"Similar community observations nearby");
 if(input.confirmed)add(5,"Observation and privacy acknowledgement confirmed");else warnings.push("Your confirmation is required before community publishing.");
 if(input.duplicate)warnings.push("Similar report already exists nearby. You can add supporting evidence instead.");
 if(input.exactPublicLocation)warnings.push("Exact locations must remain private; community locations are rounded to area cells.");
 score=Math.min(100,Math.max(0,score));return {score,level:score<40?"low":score<60?"fair":score<80?"good":"strong",reasons,warnings};
}
