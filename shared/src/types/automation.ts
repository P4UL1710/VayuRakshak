export interface AutomationRule { id: string; name: string; trigger: string; action: string; enabled: boolean; icon: "purifier" | "window" | "arrival" | "severe" }
export interface ApprovalRecord { id: string; ruleId: string; scope: "once" | "always"; approvedAt: string; status: "scheduled-demo" }
