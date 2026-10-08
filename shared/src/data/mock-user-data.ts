import type { Preferences } from "../types/user";
import type { AutomationRule } from "../types/automation";
export const user = {name:"Pawan",area:"Delhi-NCR · IIT Delhi area"};
export const defaultPreferences: Preferences = {profile:"Asthma",personalized:true,notifications:true,services:{"Calendar":true,"Wearable":true,"Purifier":true,"Telegram / WhatsApp":false}};
export const automationRules: AutomationRule[] = [
 {id:"purifier",name:"Purifier Pre-Start",trigger:"Forecast AQI > 200 before 8 AM",action:"Turn on bedroom purifier at 6:30 AM",enabled:true,icon:"purifier"},
 {id:"windows",name:"Smart Window Guidance",trigger:"Outdoor PM2.5 rises sharply",action:"Prepare a close-windows recommendation",enabled:true,icon:"window"},
 {id:"arrival",name:"Arrival Mode",trigger:"Within 1 km of home",action:"Start living-room purifier",enabled:false,icon:"arrival"},
 {id:"severe",name:"Severe Air Mode",trigger:"AQI > 350",action:"Prepare a protection plan and pause outdoor-activity reminders",enabled:true,icon:"severe"}
];
