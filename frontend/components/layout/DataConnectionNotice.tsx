"use client";
import {useApp} from "./AppProvider";
export function DataConnectionNotice(){
 const {dataStatus}=useApp();
 if(dataStatus==="loading")return <p role="status" className="fine-print mb-3">Connecting to demo API…</p>;
 if(dataStatus==="connected")return <p className="fine-print mb-3 flex items-center gap-2"><span className="live-dot"/>Demo backend connected · illustrative data</p>;
 return <div role="status" className="notice warm mb-4">{dataStatus==="fallback"?"Backend is unavailable. Showing illustrative offline demo data.":"The data service is unavailable. Sample demo values remain visible."}</div>;
}
