import {request} from "@playwright/test";
export default async function setup(){const api=await request.newContext({baseURL:"http://127.0.0.1:3100"});const response=await api.post("/api/auth/demo");if(!response.ok())throw new Error("Demo sign-in setup failed: "+await response.text());await api.storageState({path:".runtime/playwright-state.json"});await api.dispose();}
