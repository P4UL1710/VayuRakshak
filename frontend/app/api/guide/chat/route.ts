import {answerGuide} from "@/lib/vayu-guide/rag/rag-service";
import {boundedJson} from "@/lib/server/request";
export async function POST(request:Request){
 try{const body=await boundedJson(request) as {question?:unknown}|null;if(!body||typeof body.question!=="string"||!body.question.trim()||body.question.length>1000)return Response.json({error:"Use a question between 1 and 1,000 characters."},{status:400});return Response.json(answerGuide(body.question),{headers:{"Cache-Control":"no-store"}});}catch{return Response.json({error:"Invalid question payload"},{status:400});}
}
