import {test,expect} from "@playwright/test";
test("risk explanation, approval, workflow and pause work together",async({page})=>{
 await page.goto("/automations");await expect(page.locator(".score-ring:visible strong")).toHaveText("74");
 await page.getByRole("button",{name:"View decision",exact:true}).click();await expect(page.getByRole("dialog")).toContainText("Total risk score");await page.getByRole("button",{name:"Understood"}).click();
 await page.getByRole("button",{name:"Approve purifier pre-start",exact:true}).click();await page.getByRole("button",{name:"Cancel",exact:true}).click();await expect(page.locator("#workflow")).toContainText("Awaiting your approval");
 await page.getByRole("button",{name:"Approve purifier pre-start",exact:true}).click();await page.getByRole("button",{name:"Allow once",exact:true}).click();await expect(page.getByRole("status")).toContainText("Purifier pre-start scheduled for tomorrow at 6:30 AM.");await expect(page.locator("#workflow")).toContainText("EventBridge Scheduler");await expect(page.locator("#workflow")).toContainText("No external message sent");
 await page.screenshot({path:"test-results/automations-desktop.png",fullPage:true});await page.getByRole("button",{name:"Pause tomorrow"}).click();await expect(page.locator("#workflow")).toContainText("Schedule cancelled");
});
test("Vayu answers from the site with sources, rejects unknown requests and never autoplays",async({page})=>{
 let ttsCalls=0;await page.route("**/api/tts",route=>{ttsCalls++;return route.fulfill({json:{provider:"browser-fallback"}});});
 await page.goto("/");await page.getByRole("button",{name:"Vayu guide assistant. Open help."}).click();await page.getByRole("button",{name:"Give me a quick project overview",exact:true}).click();await expect(page.getByRole("heading",{name:"VayuRakshak in one minute"})).toBeVisible();await expect(page.locator(".vayu-source").first()).toBeVisible();expect(ttsCalls).toBe(0);
 await page.getByLabel("Ask about VayuRakshak",{exact:true}).fill("What is the quantum mass of Jupiter?");await page.getByRole("button",{name:"Send to Vayu"}).click();await expect(page.getByText(/I don’t have a verified answer for that/)).toBeVisible();expect(ttsCalls).toBe(0);
 await page.getByRole("button",{name:"Close Vayu chat"}).click();await expect(page.getByRole("button",{name:"Vayu guide assistant. Open help."})).toBeFocused();
});
test("desktop inactivity prompts once, dismissal persists, typing is protected",async({page})=>{
 await page.clock.install();await page.goto("/");await expect(page.locator(".vayu-launcher")).toHaveAttribute("data-guide-ready","true");await page.clock.fastForward(31_000);await expect(page.getByRole("complementary",{name:"Vayu help suggestion"})).toBeVisible();await page.getByRole("button",{name:"Not now",exact:true}).click();await page.clock.fastForward(31_000);await expect(page.locator(".vayu-prompt")).toHaveCount(0);
 await page.evaluate(()=>sessionStorage.removeItem("vayu-dismissed"));await page.goto("/agent");await expect(page.locator(".vayu-launcher")).toHaveAttribute("data-guide-ready","true");await page.getByLabel("Ask your air guardian").focus();await page.clock.fastForward(31_000);await expect(page.locator(".vayu-prompt")).toHaveCount(0);
});
test("short tour navigates only after clicks and persists progress across feature navigation",async({page})=>{
 await page.goto("/settings");await page.getByRole("button",{name:"Restart product tour"}).click();await page.getByRole("button",{name:"Start without audio"}).click();await expect(page.getByRole("dialog")).toContainText("1 of 4");await expect(page).toHaveURL(/settings/);
 await page.getByRole("link",{name:"Open this feature"}).click();await expect(page).toHaveURL(/dashboard/);await expect(page.locator(".vayu-spotlight")).toBeVisible();await page.getByRole("button",{name:"Mute narration",exact:true}).click();await expect(page.getByRole("button",{name:"Listen",exact:true})).toBeDisabled();await page.getByRole("button",{name:"Next",exact:true}).click();await expect(page.getByRole("dialog")).toContainText("2 of 4");await expect(page).toHaveURL(/dashboard/);await page.getByRole("link",{name:"Open this feature"}).click();await expect(page).toHaveURL(/routes/);await expect(page.getByRole("dialog")).toContainText("2 of 4");await page.keyboard.press("Escape");await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("mobile Vayu is manual and architecture fits",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.clock.install();await page.goto("/architecture");await page.clock.fastForward(31_000);await expect(page.locator(".vayu-prompt")).toHaveCount(0);await expect(page.getByRole("button",{name:"Vayu guide assistant. Open help."})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});
test("guide and narration endpoints validate inputs and provide honest fallback",async({request})=>{
 expect((await request.post("/api/guide/chat",{data:{question:""}})).status()).toBe(400);expect((await request.post("/api/tts",{data:{text:"My private health data"}})).status()).toBe(400);
 const answer=await request.post("/api/guide/chat",{data:{question:"How does Autopilot stay safe?"}});expect(answer.status()).toBe(200);expect((await answer.json()).grounded).toBe(true);
});
test("narration starts explicitly and pause, resume, speed and mute work",async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,"speechSynthesis",{value:{cancel(){},speak(){},pause(){},resume(){}}});});
 let ttsCalls=0;await page.route("**/api/tts",route=>{ttsCalls++;return route.fulfill({json:{provider:"browser-fallback"}});});
 await page.goto("/");await page.getByRole("button",{name:"Vayu guide assistant. Open help."}).click();await page.getByRole("button",{name:"How does the risk score work?",exact:true}).click();await expect(page.locator(".vayu-answer")).toBeVisible();expect(ttsCalls).toBe(0);
 await page.getByRole("button",{name:"Listen",exact:true}).click();await expect(page.getByText(/Browser speech fallback/)).toBeVisible();expect(ttsCalls).toBe(1);
 await page.getByRole("button",{name:"Pause narration",exact:true}).click();await page.getByRole("button",{name:"Resume",exact:true}).click();await page.getByRole("combobox",{name:"Narration speed"}).selectOption("0.9");await expect(page.getByRole("button",{name:"Pause narration",exact:true})).toHaveCount(0);
 await page.getByRole("button",{name:"Replay narration",exact:true}).click();await expect(page.getByRole("button",{name:"Pause narration",exact:true})).toBeVisible();await page.getByRole("button",{name:"Stop",exact:true}).click();await page.getByRole("button",{name:"Mute Vayu",exact:true}).click();await expect(page.getByRole("button",{name:"Listen",exact:true})).toBeDisabled();
});
