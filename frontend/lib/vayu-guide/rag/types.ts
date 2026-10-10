export type KnowledgeDocument={title:string;slug:string;route:string;section:string;text:string;tags:string[];lastUpdated:string;sourceType:string;sourceUrl?:string};
export type KnowledgeChunk=KnowledgeDocument & {id:string};
export type GuideSource={title:string;href:string;lastUpdated:string};
export type GuideAnswer={title:string;text:string;sources:GuideSource[];grounded:boolean};
