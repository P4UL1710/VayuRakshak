export interface AuthorityReportingProvider{openPortal():{configured:boolean;submitted:false;message:string};}
// Replace this boundary only after verifying an official reporting URL or integration.
// Opening a portal must never be presented as receipt or official submission.
export const authorityReportingProvider:AuthorityReportingProvider={openPortal:()=>({configured:false,submitted:false,message:"No verified authority portal is configured. Copy or download your draft for manual review; nothing has been officially filed."})};
