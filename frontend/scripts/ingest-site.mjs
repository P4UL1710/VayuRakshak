import {load} from "cheerio";
import robotsParser from "robots-parser";
import {writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
const args=process.argv.slice(2);
const option=(key,fallback)=>{const index=args.indexOf(key);return index>=0?args[index+1]:fallback;};
const rawUrl=option("--url",null);if(!rawUrl)throw new Error("Usage: npm run ingest:site -- --url https://your-own-site.example [--max-pages 25]");
const start=new URL(rawUrl);if(!["http:","https:"].includes(start.protocol)||start.username||start.password)throw new Error("Use an unauthenticated HTTP(S) URL for your own site.");
const maxPages=Number(option("--max-pages",25));if(!Number.isInteger(maxPages)||maxPages<1||maxPages>100)throw new Error("Max pages must be 1–100.");
const userAgent="VayuGuideIngest/1.0";
const delay=()=>new Promise(resolve=>setTimeout(resolve,300));
async function fetchOwn(url,redirects=0){
 if(new URL(url).origin!==start.origin||redirects>4)throw new Error("Blocked cross-origin redirect or redirect loop.");
 const response=await fetch(url,{redirect:"manual",headers:{"User-Agent":userAgent},signal:AbortSignal.timeout(8000)});
 if(response.status>=300&&response.status<400){const location=response.headers.get("location");if(!location)throw new Error("Missing redirect location");return fetchOwn(new URL(location,url).href,redirects+1);}
 return response;
}
const robotsUrl=new URL("/robots.txt",start).href;
const robotsResponse=await fetchOwn(robotsUrl);
if(!robotsResponse.ok&&robotsResponse.status!==404)throw new Error("Could not verify robots rules. Crawl stopped.");
const robots=robotsParser(robotsUrl,robotsResponse.status===404?"":await robotsResponse.text());
function normalize(value,base=start){try{const url=new URL(value,base);if(url.origin!==start.origin||url.username||url.password)return null;if(/\/(?:api|auth|login|logout|admin|account)(?:\/|$)/i.test(url.pathname)||/\.[a-z0-9]{1,8}$/i.test(url.pathname))return null;url.search="";url.hash="";return url.href;}catch{return null;}}
const queue=[normalize(start.href)];const seen=new Set();const hashes=new Set();const documents=[];let pages=0;
while(queue.length&&pages<maxPages){
 const url=queue.shift();if(!url||seen.has(url))continue;seen.add(url);
 if(robots.isAllowed(url,userAgent)===false){console.log("Robots disallowed:",new URL(url).pathname);continue;}
 await delay();const response=await fetchOwn(url);pages++;
 if(!response.ok||!response.headers.get("content-type")?.includes("text/html"))continue;
 if(Number(response.headers.get("content-length"))>2_000_000)continue;
 const html=await response.text();if(html.length>2_000_000)continue;const $=load(html);
 if(/noindex|noarchive/i.test($("meta[name='robots']").attr("content")??""))continue;
 $("a[href]").each((_,element)=>{const value=normalize($(element).attr("href"),url);if(value&&!seen.has(value)&&queue.length<250)queue.push(value);});
 const title=$("title").text().trim()||$("h1").first().text().trim()||new URL(url).pathname;
 $("script,style,nav,footer,aside,header,dialog,[hidden],[aria-hidden='true'],.sidebar,.mobile-nav,.vayu-launcher,.vayu-prompt,.toast").remove();
 $("[style]").each((_,element)=>{if(/display\s*:\s*none|visibility\s*:\s*hidden/i.test($(element).attr("style")??""))$(element).remove();});
 const main=$("main,article").first();const scope=main.length?main:$("body");
 scope.find("h1,h2,h3,h4").each((_,element)=>{const level=Number(element.tagName.slice(1));$(element).prepend("\n"+"#".repeat(level)+" ").append("\n");});
 scope.find("p,li,section,br").append("\n");const text=scope.text().replace(/[\t ]+/g," ").replace(/\n\s*\n/g,"\n\n").trim();if(text.length<80)continue;
 const hash=createHash("sha256").update(text).digest("hex");if(hashes.has(hash))continue;hashes.add(hash);
 const route=new URL(url).pathname;const section=scope.find("[id]").first().attr("id")??"";
 documents.push({title,slug:`own-site-${documents.length}`,route,section,text,tags:[...new Set((title.toLowerCase().match(/[a-z]+/g)??[]))],lastUpdated:new Date().toISOString(),sourceType:"own-site",sourceUrl:url,contentHash:hash});
 console.log("Indexed:",route);
}
const output=option("--out",null)?resolve(option("--out",null)):fileURLToPath(new URL("../content/ingested-site.json",import.meta.url));
await writeFile(output,JSON.stringify(documents,null,2)+"\n");console.log(`Saved ${documents.length} documents from ${pages} pages. Review content, then rebuild to load the new index.`);
