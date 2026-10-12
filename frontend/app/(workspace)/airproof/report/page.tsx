import {Suspense} from "react";
import {ReportWizard} from "@/components/airproof/ReportWizard";
export default function Page(){return <Suspense fallback={<p>Loading safe report flow…</p>}><ReportWizard/></Suspense>;}
