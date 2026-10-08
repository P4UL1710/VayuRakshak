# Frontend and backend deployment

## Structure

```
frontend/     Next.js UI, same-origin API proxy, standalone server, Dockerfile
backend/      Node HTTP API, validated environment config, Dockerfile
shared/       Shared TypeScript models, demo fixtures and assistant logic
scripts/      Combined launch and deployment smoke checks
package.json  npm workspaces and convenience commands
compose.yaml  Both services in one deployment
```

Use Node 24 (Node 22+ is supported), npm, and the single root `package-lock.json`. Keep all three folders in the repository: both services import `@vayurakshak/shared`.

## Local development

From the repository root:

```sh
npm ci
```

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item backend/.env.example backend/.env
npm run dev
```

macOS / Linux:

```sh
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run dev
```

Frontend: http://localhost:3000. Backend: http://localhost:4000/health.

Separate terminals are also supported:

```sh
npm run dev:backend
npm run dev:frontend
```

`npm run dev` and `npm start` launch both services and stop their child processes on Ctrl+C. For independent deployments, use the per-service commands below. The root `.env.example` contains only optional Compose/combined-launch ports; application settings belong to their own folders.

If changing the backend port for native local development, also update `BACKEND_URL` in `frontend/.env.local` to the matching port. Compose handles the internal service URL automatically.

## Frontend configuration

Local file: `frontend/.env.local`. In production, set these in the hosting service's environment settings:

| Variable | Example | Purpose |
| --- | --- | --- |
| `BACKEND_URL` | `https://your-api.example.com` | Backend base URL, without `/api`; server-only |
| `BACKEND_TIMEOUT_MS` | `5000` | Timeout for server-to-server calls |
| `DEMO_FALLBACK_ENABLED` | `true` | Labelled offline demo response when the API is unavailable |
| `PORT` | `3000` | Frontend listening port in production |
| `FRONTEND_HOST` | `0.0.0.0` | Bind address for the npm standalone launcher |

The browser only calls `/api/*` on its own origin. No backend URL or integration credential needs a `NEXT_PUBLIC_` prefix. `BACKEND_URL` is read at request time, so the same built image can be configured for different backends. See [Next.js runtime environment guidance](https://nextjs.org/docs/app/guides/self-hosting#environment-variables).

With fallback disabled, unavailable upstream data returns HTTP 503; the UI reports the unavailable service while keeping its visibly labelled sample placeholders. It does not claim they are live.

## Backend configuration

Local file: `backend/.env`. Hosting environment variables override file defaults.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Respect your host's injected port |
| `HOST` | `0.0.0.0` | Reachable container/server bind address |
| `CORS_ORIGINS` | local frontend origins | Comma-separated exact allowed origins |
| `DATA_MODE` | `demo` | Only supported mode until live adapters are implemented |
| `MAX_BODY_BYTES` | `16384` | Assistant request size limit |
| `REQUEST_TIMEOUT_MS` | `10000` | HTTP request/header timeout |
| `SHUTDOWN_TIMEOUT_MS` | `10000` | Graceful shutdown deadline |

Future integration credentials (WAQI, FIRMS, Google, Telegram, purifier, etc.) are documented only in `backend/.env.example`. They are never copied into Docker images, included in frontend bundles, or printed by the API.

Backend endpoints:

| Method | Path | Function |
| --- | --- | --- |
| GET | `/health`, `/healthz` | Liveness / deployment health check |
| GET | `/api/bootstrap` | Complete typed dashboard scenario |
| GET | `/api/air` | AQI, weather, forecast and fire envelopes |
| GET | `/api/routes` | Route comparisons |
| GET | `/api/fires` | Regional signals and trend |
| GET | `/api/calendar` | Sample events |
| GET | `/api/wearable` | Sample recovery trends |
| POST | `/api/agent` | Validated rule-based demo reply |

The assistant body is `{"question":"Which route tomorrow?","profile":"General"}`. Supported profiles: General, Child, Asthma, Elderly, Fitness. Questions are limited to 500 characters. The API uses exact-origin CORS, no-store responses, input limits, and graceful shutdown. It does not log chat content.

The current API is deliberately a demo service with public sample data; it has no user accounts, database or persistent personal-data storage. Calendar, device and messaging approval interactions remain in the frontend session and trigger no external action. Before enabling real personal data or device/calendar/message writes, add authentication, durable scoped consent, token storage, authorization and audit/revocation handling.

## Easiest deployment: Docker Compose

```sh
docker compose up --build -d
docker compose ps
```

Open http://localhost:3000. The frontend reaches the backend through the internal URL `http://backend:4000`. Backend port 4000 is bound to localhost for diagnostics; it does not need public access when both services run on the same server.

To change exposed ports, copy the root `.env.example` to `.env` and edit `FRONTEND_PORT` and `BACKEND_PORT`.

```sh
docker compose logs -f
docker compose down
```

Both images use multistage builds, unprivileged runtime users and health checks. Backend runtime contains only its bundled API and package metadata; frontend runtime contains the standalone Next.js server and static assets. Build context must be the repository root, not an individual service folder:

```sh
docker build -f frontend/Dockerfile -t vayurakshak-frontend .
docker build -f backend/Dockerfile -t vayurakshak-backend .
```

For public hosting, put HTTPS termination / a reverse proxy in front of the frontend (or use your platform's managed HTTPS). See [Next.js self-hosting guidance](https://nextjs.org/docs/app/guides/self-hosting#reverse-proxy). Set real deployment origins in `CORS_ORIGINS` if callers access the backend directly. The frontend proxy itself does not require cross-origin browser access.

## Deploy the services independently

Any Node or Docker host can run them as two services from the same repository.

| Setting | Frontend service | Backend service |
| --- | --- | --- |
| Working directory | Repository root | Repository root |
| Install | `npm ci` | `npm ci` |
| Build | `npm run build:frontend` | `npm run build:backend` |
| Start | `npm run start:frontend` | `npm run start:backend` |
| Health check | `/api/health` | `/health` |
| Main environment | `BACKEND_URL=https://your-backend-host` | `PORT` supplied by the host; `HOST=0.0.0.0` |
| Dockerfile | `frontend/Dockerfile` | `backend/Dockerfile` |
| Docker build context | Repository root | Repository root |

Deploy the backend first, then set its URL in the frontend service. The Node start script copies the frontend static assets into the standalone output before launching. Next.js monorepo tracing is configured to include the shared package; see [standalone output documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

A managed Next.js host may instead select `frontend/` as its app root with monorepo support and access to `shared/` and the root lockfile. Use its normal Next.js build integration and set `BACKEND_URL`; Docker or the root commands above are the provider-independent configuration.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:deployment
npx playwright install chromium
npm run test:e2e
docker compose config --quiet
```

`test:deployment` launches the actual compiled backend and standalone frontend on temporary ports, verifies proxying and static CSS, stops the backend to verify the labelled demo fallback, then verifies strict HTTP 503 behavior when fallback is disabled.

No hosting account has been used and nothing has been published. Docker build execution requires a running Docker engine; the native production smoke check can run without one.

The runtime dependency audit is clean. Five development-only advisories remain in the Next.js ESLint / fast-glob / micromatch / braces chain. They are not included in either runtime image. Recheck `npm audit` when upstream fixes are available; the registry's suggested Next lint downgrade is incompatible with this project.
