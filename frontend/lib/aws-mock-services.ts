export type ProtectionPolicy={policyName:string;enabled:boolean;trigger:{riskScoreGte:number;hoursBeforeOccupancy:number};action:{device:string;modeByRisk:{"60-79":"standard";"80-100":"turbo"}};notifications:boolean;overrideAllowed:true};
export const morningPolicy:ProtectionPolicy={policyName:"Morning protection",enabled:false,trigger:{riskScoreGte:60,hoursBeforeOccupancy:.5},action:{device:"bedroom-purifier",modeByRisk:{"60-79":"standard","80-100":"turbo"}},notifications:true,overrideAllowed:true};
export type WorkflowEvent={id:string;at:string;service:string;message:string;status:"complete"|"pending"|"cancelled"};
export type ProtectionSchedule={id:string;approvalId:string;at:string;mode:"standard"|"turbo";status:"scheduled"|"cancelled";events:WorkflowEvent[]};
export interface ProtectionWorkflowAdapter{schedule(approval:{id:string;scope:"once"|"always"},score:number,notifications:boolean):ProtectionSchedule;cancel(schedule:ProtectionSchedule):ProtectionSchedule}
export function tomorrowAt0630(now=new Date()){
 const india=new Date(now.getTime()+330*60_000);india.setUTCDate(india.getUTCDate()+1);india.setUTCHours(6,30,0,0);
 return new Date(india.getTime()-330*60_000).toISOString();
}
export const mockProtectionWorkflow:ProtectionWorkflowAdapter={
 schedule(approval,score,notifications){
  if(!approval.id||score<60||score>100)throw new Error("A valid approval and high protection score are required.");
  const at=tomorrowAt0630();const now=new Date().toISOString();
  const entries:[string,string,"complete"|"pending"][]=[
   ["Step Functions","Explicit approval validated; device and risk threshold checked.","complete"],
   ["DynamoDB","Approval and schedule recorded in session memory (mock).","complete"],
   ["EventBridge Scheduler","Purifier pre-start scheduled for tomorrow at 6:30 AM IST.","complete"],
   ["Device webhook","Scheduled — no device activated yet. Mock execution awaits 6:30 AM.","pending"],
   ...(notifications?[["Telegram adapter","Mock confirmation: Bedroom Purifier scheduled for 6:30 AM. No external message sent.","complete"] as [string,string,"complete"]]:[]),
  ];
  return {id:crypto.randomUUID(),approvalId:approval.id,at,mode:score>=80?"turbo":"standard",status:"scheduled",events:entries.map(([service,message,status])=>({id:crypto.randomUUID(),at:now,service,message,status}))};
 },
 cancel(schedule){return {...schedule,status:"cancelled",events:[...schedule.events.map(e=>e.status==="pending"?{...e,status:"cancelled" as const}:e),{id:crypto.randomUUID(),at:new Date().toISOString(),service:"User override",message:"Schedule cancelled; device execution is disabled.",status:"cancelled"}]};},
};
