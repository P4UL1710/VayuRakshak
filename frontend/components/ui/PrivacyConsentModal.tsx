"use client";
import { useEffect, useRef } from "react";
import { ShieldCheck, X } from "lucide-react";
export function PrivacyConsentModal({title,description,onConfirm,onCancel,allowAlways=false,confirmLabel="Allow once"}:{title:string;description:string;onConfirm:(scope:"once"|"always")=>void;onCancel:()=>void;allowAlways?:boolean;confirmLabel?:string}) {
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement;const el=dialog.current;el?.showModal();return()=>{el?.close();previous?.focus();};},[]);
 return <dialog ref={dialog} className="consent-modal" aria-labelledby="consent-title" aria-describedby="consent-description" onCancel={onCancel}>
  <button className="modal-close icon-button" onClick={onCancel} aria-label="Close approval"><X size={20}/></button>
  <div className="icon-tile"><ShieldCheck size={27}/></div><p className="eyebrow mt-4">YOUR PERMISSION COMES FIRST</p>
  <h2 id="consent-title">{title}</h2><p id="consent-description">{description}</p>
  <div className="notice mt-5">Demo mode: approval updates this session only. No external service is contacted.</div>
  <div className="modal-actions"><button className="button primary" onClick={()=>onConfirm("once")}>{confirmLabel}</button>
  {allowAlways && <button className="button secondary" onClick={()=>onConfirm("always")}>Always allow this rule</button>}
  <button className="button ghost" onClick={onCancel}>Cancel</button></div>
 </dialog>;
}
