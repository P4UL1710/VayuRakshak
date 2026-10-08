# VAYURAKSHAK AI

“We don’t just inform. We protect.”

A complete air-protection hackathon MVP with separately deployable **Next.js frontend** and **Node.js backend**, managed by npm workspaces. TypeScript models and demo data are shared between both services.

## Quick start

Requires Node 22+ (24 recommended).

```sh
npm ci
npm run dev
```

Frontend: http://localhost:3000. Backend: http://localhost:4000/health.

Defaults work without credentials or copied environment files. For customization:

- `frontend/.env.example` → `frontend/.env.local`
- `backend/.env.example` → `backend/.env`

For production:

```sh
npm run build
npm start
```

Or start both containers:

```sh
docker compose up --build -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for per-service install/build/start commands, environment settings, API endpoints, Docker instructions and health checks.

## Project structure

- `frontend/`: Next.js UI, components, server-side API proxy, frontend tests and Dockerfile.
- `backend/`: standalone Node API, environment validation, adapter boundaries, backend tests and Dockerfile.
- `shared/src/data/`: typed scenario fixtures used by both services.
- `shared/src/types/`: air, route, user and automation models.
- `shared/src/snapshot.ts`: bootstrap response contract.
- `shared/src/assistant.ts`: deterministic demo assistant.
- `scripts/`: combined process launcher and production deployment verification.

The frontend requests its bootstrap data and assistant replies through its same-origin `/api` endpoints. These proxy to the configurable backend. If the backend is offline, labelled demo fallback keeps the prototype usable. Credentials remain exclusively on the backend.

## Product features

Landing page with a lightweight atmospheric globe, CSS mobile/WebGL fallback and reduced-motion support; dashboard with 72-hour forecast, map and exposure summary; route comparison and delayed-departure scenarios; regional fire signals; personal wellness guidance and locally downloadable summary; purifier approvals and approval history; Calendar Guard suggestions; demo service connections and privacy controls.

Pages: `/`, `/dashboard`, `/map`, `/routes`, `/fire-tracker`, `/health`, `/automations`, `/calendar`, `/settings`, `/agent`.

All readings and external actions are simulated. Preferences, approval history and calendar suggestions remain in memory and reset on refresh. Chat questions and the selected demo profile are sent to your own backend on submission; no third-party service receives them. The demo backend has no database, user accounts or consequential write endpoints.

## Data and integration boundaries

Mocks: `shared/src/data/mock-*.ts`. Backend services: `backend/src/services/`. Future integration contracts: `backend/src/services/contracts.ts`. Secrets and URLs: `backend/.env.example`.

Future providers: CPCB/WAQI, Open-Meteo, NASA FIRMS, FastAPI ML forecasting, Google Calendar, Telegram/WhatsApp, Home Assistant/IFTTT/MQTT, and native wearable bridges. Credentials alone never activate real actions.

The brief calls AQI 286 “Very Poor”; official CPCB bands instead classify 201–300 as “Poor” and 301–400 as “Very Poor.” The prototype preserves the visibly labelled demo scenario. Replace `frontend/lib/aqi.ts` with provider-specific classification before a live release. See [CPCB AQI](https://airquality.cpcb.gov.in/AQI_NCR/).

Exposure scores are illustrative. The fastest-route baseline is 86: score 49 yields 43% lower estimated exposure and score 62 yields 28%. The delayed cleaner-route example's 31% uses a separate timing scenario. These are not clinical risk, measured inhaled dose or guaranteed reductions. Mode-specific times are demo multipliers; custom place inputs still use the sample IIT Delhi → Connaught Place corridor.

Guidance is educational and non-diagnostic, informed by [AirNow's asthma resource](https://www.airnow.gov/publications/asthma-and-heart-disease/asthma-and-outdoor-air-pollution/). Wearable observations do not establish pollution caused a health change.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:deployment
npx playwright install chromium
npm run test:e2e
```

## 2–3 minute judge demo

1. Landing → dashboard: show tomorrow's AQI 286 peak and 7:00–10:30 AM window.
2. **View safer route** opens the 9:05 AM delayed cleaner-route plan (31% timing scenario).
3. Compare routes and select the balanced 8:55 AM plan (28% route-only reduction).
4. Automations: cancel once to show consent, then **Allow once** for the 6:30 AM purifier plan.
5. Calendar Guard: choose a lower-AQI slot and approve a suggestion; the original event remains.
6. Health Insights: preview a wellness summary and finish with “You stay in control.”

This repository is deployable but has not been published to a hosting account.
