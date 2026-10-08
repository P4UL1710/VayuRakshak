import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/components/layout/AppProvider";
export const metadata: Metadata = {title:{default:"VayuRakshak AI — Your air guardian",template:"%s · VayuRakshak AI"},description:"We don’t just inform. We protect. Pollution forecasts, exposure-aware routes and user-approved protection for Delhi-NCR."};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}
