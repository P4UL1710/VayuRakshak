import {Suspense} from "react";
import {EvidenceSummary} from "@/components/airproof/EvidenceSummary";
export default function Page(){return <Suspense fallback={<p>Loading community evidence…</p>}><EvidenceSummary/></Suspense>;}
