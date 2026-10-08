import {defineConfig} from "@playwright/test";
export default defineConfig({
 testDir:"./tests/e2e",fullyParallel:false,timeout:45000,
 use:{baseURL:"http://127.0.0.1:3000",trace:"retain-on-failure",headless:true},
 reporter:"list",
 webServer:[
  {command:"npm run start:backend",cwd:"..",url:"http://127.0.0.1:4000/health",reuseExistingServer:true,timeout:90000},
  {command:"npm run start",url:"http://127.0.0.1:3000",reuseExistingServer:true,timeout:90000}
 ]
});
