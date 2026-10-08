import {test,expect} from "@playwright/test";
import {createDemoSnapshot} from "@vayurakshak/shared/snapshot";
test("every feature page renders without client exceptions",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 for(const route of ["/","/dashboard","/routes","/map","/fire-tracker","/health","/automations","/calendar","/settings","/agent"]){await page.goto(route);await expect(page.locator("h1").first()).toBeVisible();}
 expect(errors).toEqual([]);
});
test("purifier cancellation leaves no approval; explicit approval schedules a demo",async({page})=>{
 await page.goto("/automations");
 await page.getByRole("button",{name:"Review & approve"}).first().click();
 await expect(page.getByRole("dialog")).toBeVisible();
 await page.getByRole("button",{name:"Cancel",exact:true}).click();
 await expect(page.getByText("No actions approved yet.")).toBeVisible();
 await page.getByRole("button",{name:"Review & approve"}).first().click();
 await page.getByRole("button",{name:"Allow once",exact:true}).click();
 await expect(page.getByText("Scheduled for tomorrow at 6:30 AM.",{exact:true})).toBeVisible();
 await page.getByRole("switch",{name:"Enable Purifier Pre-Start"}).click();
 await expect(page.getByRole("switch",{name:"Enable Purifier Pre-Start"})).toHaveAttribute("aria-checked","false");
});
test("calendar suggestion is added only after consent",async({page})=>{
 await page.goto("/calendar");
 await page.getByLabel("Sunday · 6:30 AM",{exact:false}).check();
 await page.getByRole("button",{name:"Add suggestion to calendar"}).click();
 await page.getByRole("button",{name:"Cancel",exact:true}).click();
 await expect(page.getByText("Suggestion added to mock calendar:")).toHaveCount(0);
 await page.getByRole("button",{name:"Add suggestion to calendar"}).click();
 await page.getByRole("button",{name:"Approve suggestion",exact:true}).click();
 await expect(page.getByText("Suggestion added to mock calendar: Sunday · 6:30 AM")).toBeVisible();
 await expect(page.getByText("Saturday · 7:00 AM · 45 min",{exact:true})).toBeVisible();
});
test("route selection and profile preferences work across navigation",async({page})=>{
 await page.goto("/routes");
 await page.getByRole("button",{name:/Cleanest Route/}).click();
 await expect(page.getByRole("button",{name:/Cleanest Route/})).toHaveAttribute("aria-pressed","true");
 await page.getByRole("button",{name:"Leave 35 minutes later"}).click();
 await expect(page.getByText("Leave at 9:05 AM via the Cleanest Route.",{exact:true})).toBeVisible();
 await page.getByRole("link",{name:"Health Insights",exact:true}).click();
 await page.getByLabel("Wellness profile").selectOption("Child");
 await expect(page.getByText(/Consider indoor play/)).toBeVisible();
});
test("connections, deletion and empty states are actionable",async({page})=>{
 await page.goto("/settings");
 await page.locator(".settings-row").filter({has:page.getByRole("heading",{name:"Wearable",exact:true})}).getByRole("button",{name:"Disconnect"}).click();
 await page.getByRole("link",{name:"Health Insights",exact:true}).click();
 await expect(page.getByText("Connect a wearable to view optional wellness trends.")).toBeVisible();
 await page.getByRole("link",{name:"Settings",exact:true}).click();
 await page.getByRole("button",{name:"Delete mock data"}).click();
 await page.getByRole("button",{name:"Clear demo data",exact:true}).click();
 await page.getByRole("link",{name:"Calendar Guard",exact:true}).click();
 await expect(page.getByText("Connect your calendar to receive pollution-aware activity suggestions.")).toBeVisible();
});
test("mobile critical action fits and pages do not overflow",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const route of ["/","/dashboard","/routes","/map","/fire-tracker","/health","/automations","/calendar","/settings","/agent"]){
  await page.goto(route);await expect(page.locator("h1").first()).toBeVisible();
  const sizes=await page.evaluate(()=>({width:innerWidth,content:document.documentElement.scrollWidth}));
  expect(sizes.content,route).toBeLessThanOrEqual(sizes.width+1);
 }
 await page.goto("/dashboard");
 await expect(page.getByRole("link",{name:"View safer route"})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toBeVisible();
 await page.screenshot({path:"test-results/dashboard-mobile.png",fullPage:true});
});
test("desktop dashboard screenshot and demo API provenance",async({page,request})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto("/dashboard");
 await page.screenshot({path:"test-results/dashboard-desktop.png",fullPage:true});
 const response=await request.get("/api/air");expect(response.status()).toBe(200);
 const data=await response.json();expect(data.conditions.source).toBe("demo");expect(data.forecast.source).toBe("demo");
});
test("the dashboard safer-route link opens its delayed cleaner plan",async({page})=>{
 await page.goto("/dashboard");
 await page.getByRole("link",{name:"View safer route"}).click();
 await expect(page.getByText("Leave at 9:05 AM via the Cleanest Route.",{exact:true})).toBeVisible();
 await expect(page.getByRole("button",{name:/Cleanest Route/})).toHaveAttribute("aria-pressed","true");
});
test("chat approval is visible in automation history and can be revoked",async({page})=>{
 await page.goto("/agent");
 await page.getByRole("button",{name:"Approve purifier plan"}).click();
 await page.getByRole("button",{name:"Always allow this rule"}).click();
 await page.getByRole("link",{name:"Automations",exact:true}).click();
 await expect(page.getByText("Standing permission recorded for this rule.",{exact:false})).toBeVisible();
 await page.getByRole("switch",{name:"Enable Purifier Pre-Start"}).click();
 await page.getByRole("link",{name:"Overview",exact:true}).click();
 await expect(page.locator(".timeline-list").getByText("Scheduled",{exact:true})).toHaveCount(0);
});
test("wellness summary is previewed and downloaded locally",async({page})=>{
 await page.goto("/health");
 await page.getByRole("button",{name:"Generate shareable wellness summary"}).click();
 await expect(page.getByRole("heading",{name:"Wellness summary preview"})).toBeVisible();
 const download=page.waitForEvent("download");
 await page.getByRole("button",{name:"Download summary"}).click();
 expect((await download).suggestedFilename()).toBe("vayurakshak-demo-wellness-summary.txt");
});
test("landing globe has an accessible CSS fallback on mobile",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto("/");
 await expect(page.locator(".fallback-orb")).toBeVisible();
 await expect(page.locator(".globe-figure canvas")).toHaveCount(0);
 await page.screenshot({path:"test-results/landing-mobile.png",fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.goto("/");
 await expect(page.locator(".globe-figure canvas")).toBeVisible();
 // Allow the WebGL frame to reach the screenshot compositor after lazy loading.
 await page.waitForTimeout(600);
 await page.screenshot({path:"test-results/landing-desktop.png",fullPage:true});
});
test("frontend displays bootstrap API values rather than fixture-only values",async({page})=>{
 const data=createDemoSnapshot();data.current={...data.current,aqi:225};
 await page.route("**/api/bootstrap",route=>route.fulfill({json:{data,source:"demo",fetchedAt:new Date().toISOString(),backendAvailable:true}}));
 await page.goto("/dashboard");
 await expect(page.getByText("Demo backend connected · illustrative data")).toBeVisible();
 await expect(page.locator(".conditions-number strong")).toHaveText("225");
});
test("chat submission reaches the backend through the frontend proxy",async({page})=>{
 await page.goto("/agent");
 await page.getByLabel("Ask your air guardian").fill("Why are fire detections relevant?");
 const responsePromise=page.waitForResponse(response=>response.url().endsWith("/api/agent")&&response.request().method()==="POST");
 await page.getByRole("button",{name:"Send question"}).click();
 const response=await responsePromise;expect(response.status()).toBe(200);expect((await response.json()).backendAvailable).toBe(true);
 await expect(page.locator(".chat-message").last()).toContainText("Regional fire activity may contribute");
});
