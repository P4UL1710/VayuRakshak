import {readdir,readFile,writeFile} from "node:fs/promises";
const directory=new URL("../content/",import.meta.url);const docs=[];
for(const name of (await readdir(directory)).filter(name=>name.endsWith(".md"))){const source=await readFile(new URL(name,directory),"utf8");const match=source.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n# [^\n]+\r?\n([\s\S]+)$/);if(!match)throw new Error(`Invalid knowledge metadata in ${name}`);docs.push({...JSON.parse(match[1]),text:match[2].trim()});}
await writeFile(new URL("knowledge.json",directory),JSON.stringify(docs,null,2)+"\n");console.log(`Indexed ${docs.length} curated guide documents.`);
