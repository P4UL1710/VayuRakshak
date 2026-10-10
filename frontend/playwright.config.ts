import {defineConfig} from "@playwright/test";
export default defineConfig({
 testDir:"./tests/e2e",fullyParallel:false,timeout:45000,
 globalSetup:"./tests/e2e/auth.setup.ts",
 use:{baseURL:"http://127.0.0.1:3100",storageState:".runtime/playwright-state.json",trace:"retain-on-failure",headless:true},
 reporter:"list",
 webServer:[
  {command:"npm run start:backend",cwd:"..",url:"http://127.0.0.1:4100/health",env:{PORT:"4100"},reuseExistingServer:false,timeout:90000},
  {command:"npm run start",url:"http://127.0.0.1:3100",env:{PORT:"3100",BACKEND_URL:"http://127.0.0.1:4100"},reuseExistingServer:false,timeout:90000}
 ]
});
