import Link from "next/link";
import {ShieldCheck} from "lucide-react";
export default function NotFound(){return <main className="min-h-screen grid place-content-center text-center gap-5 px-6"><ShieldCheck className="mx-auto text-teal" size={45}/><p className="eyebrow">A LITTLE OFF THE PATH</p><h1>Let’s get you back to clearer air.</h1><p className="muted">This page couldn’t be found.</p><Link href="/dashboard" className="button primary">Back to dashboard</Link></main>;}
