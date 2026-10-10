# VayuRakshak AI — delivery and demo

The existing Next.js 16 / React 19, TypeScript, Tailwind and Node API architecture is preserved. Added: persistent registration/sign-in, protected workspace and API routes, demo login, explainable Indoor Protection Risk Score, Protection Autopilot modes, narrow editable approval policy, cancellation and simulated AWS audit workflow, Tomorrow’s Air Plan, AWS architecture page, Vayu Guide, inactivity help, keyboard-accessible short/full tours, grounded local retrieval, source chips, narration controls, Edge TTS bridge and same-origin content ingestion.

## Run

From this repository directory (Node 22+, npm):

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The combined launcher starts the API at port 4000 by default. No secrets or environment files are required. Production: `npm run build` then `npm start`. Existing per-service deployment and Docker instructions are in DEPLOYMENT.md.

Verification: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:deployment`, `npm run test:e2e`. Browser tests require `npx playwright install chromium` if it is not already installed.

## Login and hosting

Use **Explore as Pawan — demo account**, or email `demo@vayurakshak.ai` with password `Breathe@123`. Registration and password sign-in also work. Workspace pages and backend proxy APIs require a valid session. Logout revokes the server token. Cookies are HttpOnly and SameSite=Lax, and Secure on HTTPS. Cross-origin account writes are rejected; account login attempts are bounded per process.

Accounts use salted scrypt password hashes; only SHA-256 digests of random session tokens are stored. The npm launcher keeps the store in `frontend/.runtime/accounts.json`, outside the disposable build directory. Set `AUTH_DATA_DIR` to a persistent writable directory and `APP_ORIGIN` to the exact public HTTPS origin when deploying behind a proxy. Docker Compose mounts a persistent account volume. Demo account credentials are deliberately public; it uses only sample data.

This store supports one Node host, with atomic writes and a file lock. Use Cognito or a managed identity provider plus shared storage before running serverless/multiple instances; no Cognito resources are provisioned. Password recovery, email verification and distributed rate limiting are outside this hackathon prototype. Approval/device state remains in browser memory and resets on refresh independently of the login session.

## Guide and content

Curated documents: `frontend/content/*.md`, each with JSON metadata in a frontmatter block. After editing documents, run `npm run index:content` and rebuild. The indexed JSON is bundled into the server; chat does not crawl websites or call an external model. Keyword retrieval ranks 3–4 chunks, then returns a verified extract from the highest-ranked document with its source. Unsupported questions receive a fallback. Provider interfaces for embeddings, grounded language models and vector stores are in `frontend/lib/vayu-guide/rag/providers/`.

Optional website ingestion, only for a site you own:

```sh
npm run ingest:site -- --url https://your-own-deployed-site.example --max-pages 25
```

The crawler respects robots rules and noindex/noarchive, rejects cross-origin redirects, excludes auth/API paths and unsupported files, normalizes query/hash duplicates, strips boilerplate and hidden elements, bounds pages and document size, and rate limits requests. It writes `frontend/content/ingested-site.json`, with source route, section ID, timestamp and content hash. Review the generated content, then rebuild. Curated documentation remains the trusted default. Runtime DOM hidden by an external stylesheet cannot be detected by this HTML-only crawler; local inline/semantic hidden elements are removed.

## Optional Edge TTS

By default Listen uses a clearly labelled browser speech fallback. It may use a browser/vendor speech service. Audio never starts on idle, on receiving a chat response or on opening help. Tour narration starts only after Start with audio; each later step offers Listen/Replay. Mute and closing/changing steps stop pending audio. No personal question text is narrated.

To enable the optional server bridge:

```sh
python -m pip install -r tts-service/requirements.txt
python -m uvicorn app:app --app-dir tts-service --host 127.0.0.1 --port 8001
```

Set in `frontend/.env.local`:

```dotenv
EDGE_TTS_URL=http://127.0.0.1:8001/synthesize
EDGE_TTS_TOKEN=
```

Restart the frontend. If using a token, set the same `EDGE_TTS_TOKEN` in the bridge environment. Keep the bridge private and bind to loopback locally. For hosted deployments provide a reachable private service URL and a token. The bridge uses the community `edge-tts` package and Microsoft’s online speech service; service availability is external. Package reference: https://github.com/rany2/edge-tts.

POST `/api/tts` permits only text drawn from public guide/tour content, up to 1,500 characters; strips HTML; validates voice/rate/pitch; has a bounded audio cache and a process-wide demo request limit. Production deployments need distributed per-user rate limiting. No Edge service call occurs until a user requests narration. Network/provider failure falls back to browser speech with an honest status, or readable text if speech is unavailable.

## Risk and approval behavior

`frontend/lib/protection-risk.ts` bounds each factor and applies weights: 35% forecast AQI, 15% duration, 25% indoor PM2.5, 10% occupancy, 10% sensitivity and 5% ventilation. Missing indoor input excludes its weight and normalizes the remaining factors. The demo indoor reading is 54 µg/m³, resulting in 74 / 100. Largest-remainder rounding keeps the breakdown sum exact. It is a decision-support heuristic, not a validated medical score.

Recommend does not schedule. Ask Every Time requires fresh approval. Always allow this rule enables only the bedroom purifier morning policy. Its minimum threshold is 60; standard mode covers 60–79, turbo 80–100; time is 6:30 AM IST before 7 AM occupancy. Pause/disable cancels pending execution; edits revoke the old standing rule and require fresh consent. All approvals and schedules reset on refresh. The mock webhook stays pending and never turns on hardware. No real background scheduler runs in this prototype.

## Replace mocks

- Air/weather/forecast/fire/route/calendar/device/wearable/messaging: `backend/src/services/contracts.ts` and `backend/src/services/demo.ts`.
- Approval → validation → scheduler → pending webhook → notification: `frontend/lib/aws-mock-services.ts`; browser orchestration is in `frontend/components/layout/AppProvider.tsx`. Move approval records and policy evaluation to an authenticated server before enabling live device control. Use server-side idempotency, policy validation and cancellation.
- Provider credentials: `backend/.env.example`. Optional frontend server settings: `frontend/.env.example`. AWS placeholders include `AWS_REGION`, `AWS_PROTECTION_TABLE`, `AWS_PROTECTION_STATE_MACHINE_ARN`, `AWS_SCHEDULER_ROLE_ARN` and optional `BEDROCK_MODEL_ID`. These do not activate live services.
- Guide model/vector integration: `frontend/lib/vayu-guide/rag/providers/`. Edge speech integration: `frontend/lib/vayu-guide/tts/providers/edge-tts.ts`.

## 2–3 minute demo

1. **0:00–0:35:** Landing: show the atmospheric 3D globe, the track/warn/change promise, and wait 30 seconds for Vayu’s help prompt. Choose Give me a quick tour, then Start with audio (or text).
2. **0:35–1:10:** Use the demo login, then click Open this feature to reach the forecast. Show AQI 286 and 7–10:30 AM, then compare route choices. Explain 43% cleanest and 28% balanced estimated route reductions. Review Tomorrow’s Air Plan.
3. **1:10–1:55:** Finish/exit the tour. Open Automations, show score 74 and View decision. Approve purifier pre-start → Allow once. Show the success toast, EventBridge scheduling and pending webhook. Pause tomorrow to demonstrate cancellation.
4. **1:55–2:30:** Open Vayu help. Ask Give me a quick project overview and show the grounded answer and source chip. Optionally Listen. End with “We don’t just inform. We protect.”

## Remaining real-world limitations

Air readings, forecasts, route scores, calendars, wearable data and device actions are illustrative. Custom route inputs use the sample IIT Delhi corridor. Accounts and hashed session tokens persist in a local server JSON store. Actual AWS resources, live provider adapters, external notifications and hardware execution are not provisioned. Guide feedback/preferences persist locally, while sensitive chat and personal application state do not. The brief’s AQI 286 → Very Poor category is explicitly labelled a demo classification; CPCB places 201–300 in Poor. Edge service transport and voice output need testing in the final deployment environment. This is a runnable prototype, not an unattended or medically validated protection system.
