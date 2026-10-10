import type {KnowledgeChunk} from "./types";
const stop=new Set(["what","how","does","the","a","is","me","i","you","to","give","quick","about","it","my","can","do","and","in","of","this","for","are","why"]);
export const tokenize=(text:string)=>text.toLowerCase().match(/[a-z0-9]+/g)?.filter(t=>!stop.has(t))??[];
export function retrieve(question:string,chunks:KnowledgeChunk[],limit=4){
 const tokens=tokenize(question);const overview=/overview|project overview|what.*vayurakshak|what.*project|one minute/i.test(question);
 return chunks.map(chunk=>{
  const content=tokenize(chunk.text);const labels=tokenize(`${chunk.title} ${chunk.tags.join(" ")}`);
  const score=tokens.reduce((sum,token)=>sum+(labels.includes(token)?5:0)+(content.includes(token)?1:0),0)+(overview&&chunk.slug==="overview"?25:0);
  return {chunk,score};
 }).filter(r=>r.score>=5).sort((a,b)=>b.score-a.score).slice(0,limit);
}
