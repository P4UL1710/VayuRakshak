# AirProof — Fix My Area Tomorrow

“Turn local pollution into evidence and action.” Protect yourself today. Fix your air tomorrow.

AirProof extends the existing protection product without replacing forecasts, routes, purifier consent, Calendar Guard, Fire Tracker or Vayu Guide. Open `/airproof` from the sidebar, mobile menu, Profile page or dashboard card. Demo access uses **Explore as Pawan — demo account**; there is no shared password.

## Working flow

- `/airproof`: concern categories, sample local signals, anonymized reports and your local drafts.
- `/airproof/report`: six steps: category, local image/description, location/time, completeness, editable English/Hindi draft, explicit private save/community publishing.
- `/airproof/report/[id]`: private evidence for your own session, anonymized public report, incident status timeline, supporting notes and correction requests.
- `/airproof/hotspots`: time/category/completeness/area filters, approximate signal clusters and community summary.
- `/airproof/evidence-summary`: selected report totals, timeline, approximate map region, completeness distribution, neutral observations, printable HTML and editable collective complaint.

The scenario contains 44 **sample** community reports: 14 suspected waste-burning observations, 9 construction-dust concerns and 21 vehicle-idling observations. These are unverified fixtures, not actual citizen submissions. New reports are local to the current browser session. Report counts and summary exports follow the active filters.

## Completeness, not proof

`frontend/lib/airproof/evidence-quality.ts` assigns media 30, location 20, timestamp 15, useful description (30+ characters) 10, decoded valid image 10, nearby reports 10, confirmation 5. Total 0–100: Low 0–39, Fair 40–59, Good 60–79, Strong 80–100. Warnings cover missing media/context, low light, duplication, missing acknowledgement and exact public locations. Nearby citizen reports do not corroborate legal responsibility or establish an AQI cause.

`analysis-provider.ts` checks JPEG/PNG/WebP MIME, an 8 MB limit, image decoding, dimensions and mean luminance on a 32×32 sample. SHA-256 of the original file supports local duplicate checks. Re-encoding a resized image removes original metadata. Optional full-frame blur affects only a local preview; it is not face/plate detection or a privacy guarantee. Category/CV suggestions are explicitly mocked.

## Privacy and abuse boundaries

Public output uses a strict allowlist in `privacy-utils.ts`: category, timestamp, predefined locality/area cell, completeness, status, fixture label and report ID. Grid coordinates are centered in 0.02-degree cells (roughly 2 km near Delhi). Exact locations, arbitrary addresses, reporter identity, images, descriptions and complaint edits never appear in community cards/maps/exports. Unknown locality text is replaced with “Approximate area.” Private location is locally visible only in your own report view.

The flow is private by default. Community publishing requires approximate visibility plus the observation/privacy acknowledgement. Public titles are generated from controlled category and area, so user descriptions cannot name or accuse a person publicly. Editable drafts remain private. Text exports and HTML escape user content; uploaded SVG/HTML files are rejected. Safety messages ask users to stay away from smoke, fire, traffic, machinery and private property.

Local publishing limits allow at most three reports per area/category/hour. Duplicate submitted file hashes are blocked with a link path to an existing incident; supporting notes provide an alternative and are private, limited to three per incident/session. Correction requests are stored in session state with an honest “no moderator notified” status. These controls reset on refresh and are not production spam protection.

## 60-second demo

1. Dashboard: show Tomorrow’s Air Plan, then **Fix your area tomorrow**.
2. AirProof: select **Suspected open waste burning**, Continue, upload a safe sample photo and add a factual description.
3. Confirm Hauz Khas, time in IST, and **Approximate area for community map**. Geolocation denial has a manual area fallback.
4. Review completeness reasons. Generate and edit the English draft, then switch to हिन्दी.
5. Review sharing options, tick the acknowledgement and **Publish anonymized community report**.
6. Open the community hotspot map, create a collective evidence summary, preview, download printable HTML or **Print / Save as PDF**. End: “Protect yourself today. Fix your air tomorrow.”

## Integration and limitations

Official reporting is a mock boundary in `frontend/lib/airproof/authority-provider.ts`. No verified reporting URL is configured, and no report, message or complaint is automatically submitted. Opening a future official portal must still be distinct from confirmed filing. Verified integrations need explicit user consent, receipt tracking and server-side authorization.

Reports/media/drafts/corrections/supporting notes remain in browser memory and reset on refresh. A local report URL does not restore lost data. Text/HTML exports do not embed uploaded media. Print/Save as PDF uses browser printing; a PDF engine is not bundled. Video, live camera and voice-note controls are labelled placeholders. No advanced CV, public upload service, official inspection, enforcement guarantee, validated improvement measurement or production moderation is implemented.

Production work: authenticated per-user storage and access controls; private encrypted object storage; real moderation and privacy review; distributed rate limits and duplicate analysis; verified official reporting adapters; user-controlled corrections and receipt/inspection history; and cautiously labelled time-series context that never attributes causation without verified evidence. See the architecture page for AWS integration targets; no AWS resources are provisioned.

## Guide and verification

`frontend/content/airproof.md` is indexed into the grounded guide. Six AirProof suggested questions are available, and the full tour now has nine steps with AirProof before privacy/control. TTS continues to allow only public curated guide/tour text, never submitted evidence or complaints.

Run `npm run index:content`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:deployment`, and `npm run test:e2e`. Tests cover scoring, private-field projection, duplicates/rate limits, neutral bilingual drafts, filtered safe exports, denied geolocation, publishing acknowledgement, editable drafts, upload preview, corrections, mobile layouts, accessibility and tour/RAG integration.
