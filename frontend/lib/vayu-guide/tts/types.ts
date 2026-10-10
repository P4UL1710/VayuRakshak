export type NarrationRequest={text:string;voice:string;rate:string;pitch:string};
export interface TTSProvider{synthesize(request:NarrationRequest):Promise<Uint8Array>}
