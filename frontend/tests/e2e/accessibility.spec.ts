import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("critical surfaces meet automated WCAG checks",async({page})=>{
 const findings=[];for(const route of ["/login","/","/dashboard","/routes","/automations","/settings","/architecture"]){await page.goto(route);await expect(page.locator("h1,h2").first()).toBeVisible();const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();if(result.violations.length)findings.push({route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});}expect(findings).toEqual([]);
});
test("guide drawer and consent dialog support keyboard and accessible labels",async({page})=>{
 await page.goto("/automations");await page.getByRole("button",{name:"Approve purifier pre-start",exact:true}).click();expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa"]).analyze()).violations).toEqual([]);await page.keyboard.press("Escape");await expect(page.getByRole("button",{name:"Approve purifier pre-start",exact:true})).toBeFocused();await page.getByRole("button",{name:"Vayu guide assistant. Open help."}).click();expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa"]).analyze()).violations).toEqual([]);await page.keyboard.press("Escape");await expect(page.getByRole("button",{name:"Vayu guide assistant. Open help."})).toBeFocused();
});
test("reduced motion stops decorative animation and WebGL loss shows the fallback",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");await expect(page.locator(".globe-figure canvas")).toBeVisible();expect(await page.locator(".vayu-character").first().evaluate(element=>getComputedStyle(element).animationName)).toBe("none");await page.locator(".globe-figure canvas").evaluate(canvas=>canvas.dispatchEvent(new Event("webglcontextlost",{cancelable:true})));await expect(page.locator(".fallback-orb")).toBeVisible();await expect(page.locator(".globe-figure canvas")).toHaveCount(0);
});
test("small mobile widths fit the main plan and guide controls",async({page})=>{
 await page.setViewportSize({width:320,height:740});for(const route of ["/login","/dashboard","/routes","/automations","/settings"]){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth),route).toBeLessThanOrEqual(320);}await page.getByRole("button",{name:"Vayu guide assistant. Open help."}).click();await page.getByRole("button",{name:"How does the risk score work?",exact:true}).click();await expect(page.locator(".vayu-answer")).toBeVisible();expect(await page.locator(".vayu-chat-drawer").evaluate(element=>element.scrollWidth)).toBeLessThanOrEqual(320);await page.screenshot({path:"test-results/vayu-mobile.png",fullPage:true});
});
