import {Suspense} from "react";
import {LoginForm} from "@/components/auth/LoginForm";
export const metadata={title:"Sign in — Your air protection starts here"};
export default function Login(){return <Suspense fallback={<main className="login-loading">Preparing your air protection…</main>}><LoginForm/></Suspense>;}
