// Deterministic demo assistant shared by the API and offline frontend fallback.
// This module has no secrets and cannot send messages or control a device.
export function demoReply(input:string,profile:string){
 const q=input.toLowerCase();
 if(/symptom|emergency|chest|breathless|wheez/.test(q))return "I can offer environmental guidance, but I can’t assess symptoms. Consider consulting a clinician for symptoms or urgent concerns. Seek urgent medical help for severe breathing difficulty or chest pain.";
 if(/purifier|automat|approve/.test(q))return "A bedroom purifier pre-start at 6:30 AM is prepared. Use “Approve purifier plan” to review it. I won’t control a device or schedule anything without approval.";
 if(/calendar|run|cricket/.test(q))return "Your Saturday 7 AM run overlaps with forecast AQI 312. Calendar Guard offers Saturday 2 PM (AQI 182), Sunday 6:30 AM (AQI 155), or an indoor workout. Each change needs your approval.";
 if(/fire|stubble|why/.test(q))return "Regional fire activity may contribute alongside traffic, dust, industry and weather. Northwest winds may influence Delhi tomorrow morning; confidence is moderate.";
 if(/route|travel|commut|asthma|do\b|mask/.test(q))return "I understand wanting a more comfortable commute"+(profile==="Asthma"?" with asthma.":".")+" Consider leaving at 8:55 AM via the Balanced Route (28% lower estimated exposure), or 9:05 AM for the delayed cleaner-route plan (31%). Reduce outdoor exertion; a well-fitting particulate-filtering mask may help. This is wellness guidance, not diagnosis. Ask a clinician about symptoms; seek urgent help for emergencies.";
 if(/air|aqi|delhi|pollut|forecast/.test(q))return "The illustrative IIT Delhi AQI is 218, with PM2.5 at 142 µg/m³. Tomorrow’s forecast peaks at 286 during 7:00–10:30 AM. These are demo values, not live measurements.";
 return "I can help with air quality, commute routes, outdoor activities, regional fire signals and purifier plans. Try “Which route should I take tomorrow?” This prototype uses a rule-based demo assistant.";
}
