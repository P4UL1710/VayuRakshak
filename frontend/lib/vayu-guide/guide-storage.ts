export type GuidePreferences={idleHelp:boolean;narration:boolean;muted:boolean;completed:boolean};
export const defaultGuidePreferences:GuidePreferences={idleHelp:true,narration:false,muted:false,completed:false};
export function readGuidePreferences():GuidePreferences{try{const stored=JSON.parse(localStorage.getItem("vayu-preferences")??"{}");const result={...defaultGuidePreferences};for(const key of Object.keys(result) as (keyof GuidePreferences)[])if(typeof stored?.[key]==="boolean")result[key]=stored[key];return result;}catch{return {...defaultGuidePreferences};}}
export function saveGuidePreferences(value:GuidePreferences){try{localStorage.setItem("vayu-preferences",JSON.stringify(value));}catch{/* Private browsers can disable storage; the guide still works in memory. */}}
export function sessionGet(key:string){try{return sessionStorage.getItem(`vayu-${key}`);}catch{return null;}}
export function sessionSet(key:string,value:string){try{sessionStorage.setItem(`vayu-${key}`,value);}catch{}}
