import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,rm,readFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {authenticate,register,createSession,findSession,revokeSession,DEMO_ACCOUNT,safeDestination} from "../lib/auth/store";
test("accounts hash passwords, validate opaque sessions, and revoke logout tokens",async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),"vayu-auth-"));const previous=process.env.AUTH_DATA_DIR;process.env.AUTH_DATA_DIR=directory;
 try{const demo=await authenticate(DEMO_ACCOUNT.email,DEMO_ACCOUNT.password);assert.ok(demo?.demo);assert.equal(await authenticate(DEMO_ACCOUNT.email,"wrongpass"),null);const user=await register("Judge","judge@example.com","LongPassword123");assert.ok(user);assert.equal(await register("Judge","judge@example.com","LongPassword123"),null);const token=await createSession(user);assert.equal((await findSession(token))?.name,"Judge");assert.equal(await findSession("f".repeat(64)),null);const contents=await readFile(path.join(directory,"accounts.json"),"utf8");assert.equal(contents.includes("LongPassword123"),false);assert.equal(contents.includes(token),false);await revokeSession(token);assert.equal(await findSession(token),null);}finally{if(previous)process.env.AUTH_DATA_DIR=previous;else delete process.env.AUTH_DATA_DIR;await rm(directory,{recursive:true,force:true});}
});
test("login redirect stays internal",()=>{for(const unsafe of ["//evil.example","https://evil.example","/\\evil.example","/login",null])assert.equal(safeDestination(unsafe),"/dashboard");assert.equal(safeDestination("/routes?plan=delayed"),"/routes?plan=delayed");});
test("parallel session reads do not interrupt account writes",async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),"vayu-auth-parallel-"));const previous=process.env.AUTH_DATA_DIR;process.env.AUTH_DATA_DIR=directory;
 try{const user=await authenticate(DEMO_ACCOUNT.email,DEMO_ACCOUNT.password);assert.ok(user);const token=await createSession(user);
  const reads=(async()=>{for(let i=0;i<100;i++)assert.equal((await findSession(token))?.id,user.id);})();
  await Promise.all([reads,...Array.from({length:8},(_,i)=>register(`Judge ${i}`,`judge${i}@example.com`,"LongPassword123"))]);
  const db=JSON.parse(await readFile(path.join(directory,"accounts.json"),"utf8"));assert.equal(db.users.length,9);
 }finally{if(previous)process.env.AUTH_DATA_DIR=previous;else delete process.env.AUTH_DATA_DIR;await rm(directory,{recursive:true,force:true});}
});
