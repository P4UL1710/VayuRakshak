"use client";
import {ErrorState} from "@/components/ui/States";
export default function ErrorPage({reset}:{reset:()=>void}){return <ErrorState message="We couldn’t prepare this view. Your approval is still required for every action." onRetry={reset}/>;}
