export type PollutionConcernCategory="waste_burning"|"visible_smoke"|"construction_dust"|"road_dust"|"vehicle_idling"|"industrial_emission"|"diesel_generator"|"other";
export type ReportVisibility="private"|"community_approximate";
export type EvidenceQualityLevel="low"|"fair"|"good"|"strong";
export type AirProofReportStatus="draft"|"community_published"|"complaint_copied"|"submitted_by_user"|"closed";
export type EvidenceQuality={score:number;level:EvidenceQualityLevel;reasons:string[];warnings:string[]};
export type ReportMedia={type:"image"|"video";url:string;localPreview?:boolean;hash?:string;width?:number;height?:number;brightness?:number;privacyBlurred?:boolean};
export type AirProofReport={id:string;category:PollutionConcernCategory;description?:string;media:ReportMedia[];createdAt:string;observedAt:string;location:{latitude?:number;longitude?:number;approximateArea:string;publicLatitude?:number;publicLongitude?:number;accuracyMeters?:number};visibility:ReportVisibility;evidenceQuality:EvidenceQuality;airContext:{aqi:number;pm25:number;windSpeedKmh:number;windDirection:string};nearbyPattern?:{similarReportsLast30Days:number;hotspotName?:string;confidence:"low"|"medium"|"high"};status:AirProofReportStatus;userConfirmation:boolean;publicDisplay:{anonymized:boolean;facesBlurred?:boolean;platesBlurred?:boolean};englishDraft?:string;hindiDraft?:string;demo?:boolean;};
export type PublicReport={id:string;category:PollutionConcernCategory;observedAt:string;area:string;latitude?:number;longitude?:number;quality:EvidenceQuality;status:"community_published"|"closed";demo:boolean;};
export const categories:{id:PollutionConcernCategory;label:string;description:string}[]=[
 {id:"waste_burning",label:"Suspected open waste burning",description:"Visible smoke near discarded material"},
 {id:"visible_smoke",label:"Visible smoke",description:"Describe smoke you observed from a safe distance"},
 {id:"construction_dust",label:"Construction dust",description:"Dust observed near building activity"},
 {id:"road_dust",label:"Road dust",description:"Visible dust along a road or pavement"},
 {id:"vehicle_idling",label:"Vehicle idling",description:"Repeated stationary vehicles with engines running"},
 {id:"industrial_emission",label:"Industrial emission concern",description:"An observation requiring authority inspection"},
 {id:"diesel_generator",label:"Diesel generator smoke",description:"Visible smoke near a generator"},
 {id:"other",label:"Other concern",description:"Describe only what you observed"},
];
export const categoryLabel=(id:PollutionConcernCategory)=>categories.find(c=>c.id===id)?.label??"Other concern";
