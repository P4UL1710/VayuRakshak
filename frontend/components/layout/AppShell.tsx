import {Sidebar} from "./Sidebar";
import {Topbar} from "./Topbar";
import {MobileBottomNav} from "./MobileBottomNav";
import {DataConnectionNotice} from "./DataConnectionNotice";
export function AppShell({children}:{children:React.ReactNode}) {return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to content</a><Sidebar/><div className="workspace"><Topbar/><main id="main-content" className="workspace-main"><DataConnectionNotice/>{children}<footer className="app-footer"><span>VayuRakshak AI · We don’t just inform. We protect.</span><span>Illustrative data · Wellness guidance, not medical diagnosis</span></footer></main></div><MobileBottomNav/></div>;}
