import curated from "@/content/knowledge.json";
import ingested from "@/content/ingested-site.json";
import type {KnowledgeDocument,KnowledgeChunk} from "./types";
export const knowledgeDocuments:KnowledgeDocument[]=[...curated,...ingested];
export function chunkDocuments(documents:KnowledgeDocument[]):KnowledgeChunk[]{
 return documents.flatMap(doc=>{
  const words=doc.text.replace(/\s+/g," ").trim().split(" ");const chunks:KnowledgeChunk[]=[];
  // ~350 tokens per chunk, with ~70 tokens of overlap.
  for(let start=0;start<words.length;start+=210){chunks.push({...doc,id:`${doc.slug}-${start}`,text:words.slice(start,start+260).join(" ")});if(start+260>=words.length)break;}
  return chunks;
 });
}
