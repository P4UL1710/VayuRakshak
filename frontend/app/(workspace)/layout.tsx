import { AppShell } from "@/components/layout/AppShell";
import {getSessionUser} from "@/lib/auth/session";
import {redirect} from "next/navigation";
export default async function WorkspaceLayout({children}:{children:React.ReactNode}){if(!await getSessionUser())redirect("/login");return <AppShell>{children}</AppShell>;}
