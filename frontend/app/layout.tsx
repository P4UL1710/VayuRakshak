import "@fontsource-variable/manrope";
import "./globals.css";
import "./guide.css";
import type { Metadata } from "next";
import { AppProvider } from "@/components/layout/AppProvider";
import {VayuGuideController} from "@/components/vayu-guide/VayuGuideController";
import {getSessionUser} from "@/lib/auth/session";
import "./experience.css";
export const metadata: Metadata = {title:{default:"VayuRakshak AI — Your air guardian",template:"%s · VayuRakshak AI"},description:"We don’t just inform. We protect. Pollution forecasts, exposure-aware routes and user-approved protection for Delhi-NCR."};
export default async function RootLayout({children}:{children:React.ReactNode}) {
 const user=await getSessionUser();
 return <html lang="en"><body><AppProvider user={user}><VayuGuideController>{children}</VayuGuideController></AppProvider></body></html>;
}
