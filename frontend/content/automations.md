---
{"title":"Protection Autopilot and risk score","slug":"automations","route":"/automations","section":"protection-autopilot","tags":["risk","score","autopilot","purifier","automation","safe","approval","rule"],"lastUpdated":"2026-10-08","sourceType":"curated"}
---
# Protection Autopilot and risk score
Indoor Protection Risk Score is a transparent 0–100 decision-support score, not medically validated. Weights: forecast AQI 35%, spike duration 15%, optional indoor PM2.5 25%, occupancy proximity 10%, sensitivity preference 10%, ventilation 5%. Inputs are bounded. Missing indoor readings are excluded and remaining weights normalized. The demo computes 74 / 100 (High); displayed whole-point contributions sum exactly.

Bands are Low 0–29, Elevated 30–59, High 60–79 and Severe 80–100. High suggests standard purifier pre-start 30 minutes before occupancy; Severe suggests turbo filtration and indoor guidance.

Recommend creates suggestions only. Ask Every Time requires each approval. Autopilot requires an explicitly approved narrow morning-protection policy: bedroom purifier, score at or above the chosen threshold (minimum 60), 30 minutes before 7 AM occupancy, Standard at 60–79 and Turbo at 80–100. Allow once schedules one demo action. Always allow this rule enables that policy. Pause, disable or edit cancels active schedules; edited rules require new approval. No real device is controlled.

The mock workflow validates approval in Step Functions, records it in simulated DynamoDB, schedules 6:30 AM IST via EventBridge, leaves the device webhook pending, and previews a Telegram confirmation only if that integration and notifications are enabled. No external message is sent.
