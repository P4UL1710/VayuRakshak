import {chunkDocuments,knowledgeDocuments} from "./knowledge-loader";
import {retrieve} from "./keyword-retriever";
import type {GuideAnswer} from "./types";
const chunks=chunkDocuments(knowledgeDocuments);
export function answerGuide(question:string):GuideAnswer{
 const results=retrieve(question,chunks);
 if(!results.length||/ignore.*instruction|system prompt|diagnos|prescri|dosage|cure|password|api key/i.test(question))return {title:"Let’s stay with verified information",text:"I don’t have a verified answer for that in the VayuRakshak guide yet. I can explain the dashboard, routes, forecasts, automations, privacy, or project approach.",sources:[],grounded:false};
 const first=results[0].chunk;
 // Extractive generation: no invented claims, and no network/model required.
 const doc=knowledgeDocuments.find(d=>d.slug===first.slug)!;
 return {title:doc.title,text:doc.text,sources:[{title:doc.title,href:`${doc.route}#${doc.section}`,lastUpdated:doc.lastUpdated}],grounded:true};
}
