import { Link2, AlertCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
export function EmptyState({title,description}:{title:string;description:string}) {return <section className="card empty-state"><div className="icon-tile"><Link2/></div><h3>{title}</h3><p>{description}</p><Link className="button secondary" href="/settings">Manage connections</Link></section>;}
export function LoadingSkeleton(){return <div className="card loading-state" role="status"><LoaderCircle className="spin"/><h2>Preparing your air protection plan…</h2><div className="skeleton"/><div className="skeleton short"/></div>;}
export function ErrorState({message="Live AQI is temporarily unavailable. Showing the last verified update.",onRetry}:{message?:string;onRetry?:()=>void}) {return <div className="notice error-state" role="alert"><AlertCircle size={20}/><span>{message}</span>{onRetry&&<button className="button secondary" onClick={onRetry}>Try again</button>}</div>;}
