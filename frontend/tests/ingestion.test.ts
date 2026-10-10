import test from "node:test";
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {mkdtemp,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
test("own-site ingestion obeys robots, deduplicates queries and strips navigation",async()=>{
 const hits:string[]=[];const directory=await mkdtemp(path.join(tmpdir(),"vayu-ingest-"));
 const server=createServer((request,response)=>{const url=request.url??"/";hits.push(url);if(url==="/robots.txt"){response.setHeader("Content-Type","text/plain");response.end("User-agent: *\nDisallow: /blocked\n");return;}response.setHeader("Content-Type","text/html");response.end(`<html><head><title>Own guide page</title></head><body><nav>REMOVE NAVIGATION</nav><main><h1 id="plan">Protection plan</h1><p>${"Review forecasts and approve protective actions. ".repeat(5)}</p><p hidden>REMOVE HIDDEN</p><script>REMOVE SCRIPT</script><a href="/blocked">blocked</a><a href="/api/private">api</a><a href="/?q=duplicate">duplicate</a><a href="https://external.invalid/">external</a></main><footer>REMOVE FOOTER</footer></body></html>`);});
 await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));const address=server.address();assert.ok(address&&typeof address!=="string");
 try{const output=path.join(directory,"index.json");await promisify(execFile)(process.execPath,["scripts/ingest-site.mjs","--url",`http://127.0.0.1:${address.port}`,"--out",output]);const docs=JSON.parse(await readFile(output,"utf8"));assert.equal(docs.length,1);assert.equal(docs[0].section,"plan");assert.equal(docs[0].sourceType,"own-site");assert.ok(docs[0].contentHash);for(const excluded of ["REMOVE NAVIGATION","REMOVE HIDDEN","REMOVE SCRIPT","REMOVE FOOTER"])assert.equal(docs[0].text.includes(excluded),false);assert.deepEqual(hits,["/robots.txt","/"]);}finally{await new Promise<void>(resolve=>server.close(()=>resolve()));await rm(directory,{recursive:true,force:true});}
});
