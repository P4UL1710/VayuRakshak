import type {KnowledgeChunk} from "../types";
export interface VectorStoreProvider{upsert(chunks:KnowledgeChunk[],vectors:number[][]):Promise<void>;search(vector:number[],limit:number):Promise<KnowledgeChunk[]>}
