import type {AirProofReport,PublicReport} from "./types";
import {publicProjection} from "./privacy-utils";
export const REPORT_LIMIT=3;export const REPORT_WINDOW_MS=60*60*1000;
export function checkPublish(report:AirProofReport,ownReports:AirProofReport[],community:PublicReport[],now=Date.now()){
 if(!report.userConfirmation)return "Confirm your observation and privacy acknowledgement before publishing.";
 if(report.visibility!=="community_approximate")return "Choose approximate community visibility before publishing.";
 if(!report.location.approximateArea||!Number.isFinite(Date.parse(report.observedAt)))return "Confirm your area and observation time.";
 if(Date.parse(report.observedAt)>now+5*60000)return "The observation time cannot be in the future.";
 if(community.some(r=>r.id===report.id))return "This report is already on the community map.";
 if(ownReports.filter(r=>r.id!==report.id&&r.status==="community_published"&&r.category===report.category&&r.location.approximateArea===report.location.approximateArea&&now-Date.parse(r.createdAt)<REPORT_WINDOW_MS).length>=REPORT_LIMIT)return "Local demo limit reached: 3 reports per area and category each hour.";
 if(report.media.some(media=>media.hash&&ownReports.some(r=>r.id!==report.id&&r.status==="community_published"&&r.media.some(existing=>existing.hash===media.hash))))return "Similar report already exists nearby. Open the existing report to add supporting evidence instead.";
 return null;
}
export function publishProjection(report:AirProofReport){return publicProjection({...report,visibility:"community_approximate",status:"community_published"});}
