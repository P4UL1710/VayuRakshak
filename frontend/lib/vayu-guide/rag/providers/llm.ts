import type {KnowledgeChunk,GuideAnswer} from "../types";
export interface GroundedLLMProvider{answer(question:string,context:KnowledgeChunk[]):Promise<GuideAnswer>}
