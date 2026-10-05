# CloudScale API and telemetry

## Current status

CloudScale is a routed React/Vite dashboard with a working interactive demo, a local Express API, and a shared TypeScript/Zod infrastructure contract. The API currently serves in-memory demo data. The UI and demo controls remain usable if the API is unavailable.

**AWS is not connected yet.** No AWS credentials, SDK, live infrastructure reads, or cloud writes are used. The next planned phase is AWS integration behind the existing provider boundary.

The dashboard reads infrastructure snapshots through a frontend provider boundary. The active provider requests the CloudScale API; when the API is unavailable or returns an invalid response, the dashboard continues in Demo Mode using its existing in-browser simulator.

## Current architecture

```text
React pages and components
  -> useDashboardTelemetry / frontend InfrastructureProvider
    -> API provider (polls /api/infrastructure and posts demo controls)
      -> Express routes
        -> server InfrastructureProvider
          -> SimulatorInfrastructureProvider (in-memory demo data)
```

The shared data contracts live in `lib/api-zod/src/infrastructure.ts` and are inferred from Zod schemas. Both the API and frontend validate snapshots against those schemas. The browser simulator remains available as an independent fallback; the server simulator has its own process-local state. No AWS services, credentials, database, or cloud connection are used.

### Demo Provider

The server-side `SimulatorInfrastructureProvider` is the current API Demo Provider. It uses the dashboard's existing traffic and CPU scaling model to generate metrics, chart points, instance counts, and state-driven events in memory. The browser's existing simulator is a separate local fallback with the same shared data contract.

The provider interface is the replacement point for a future AWS-backed implementation. A future provider can fetch telemetry asynchronously and map it into the same shared contracts, while the routes and dashboard keep their existing API/data shape. The demo provider is illustrative and makes no claims about live infrastructure.

## API endpoints

All endpoints are served under `/api` and return JSON.

| Method and path | Response |
| --- | --- |
| `GET /api/health` | `{ "status": "ok" }` |
| `GET /api/telemetry` | `{ metrics, chartPoints }` from the shared telemetry schema |
| `GET /api/infrastructure` | Full application, instances, load balancer, scaling group, metrics, chart, and events snapshot |
| `GET /api/events` | Recent infrastructure event array |

Existing demo endpoints remain available: `GET /api/infrastructure/instances`, `/load-balancer`, `/auto-scaling`, `/metrics`, and `/events`; `POST /api/infrastructure/actions/traffic-spike` and `/baseline` control the server-side demo simulation. Unknown `/api` paths return 404 JSON. Invalid JSON request bodies return 400, and unexpected provider errors return a generic 500 JSON response while details are logged on the server.

## Run locally (PowerShell)

Start the API in one terminal:

```powershell
$env:PORT = "3000"
pnpm --filter @workspace/api-server run dev
```

Start the frontend in a second terminal:

```powershell
$env:PORT = "5173"
$env:BASE_PATH = "/"
$env:API_PROXY_TARGET = "http://127.0.0.1:3000"
pnpm --filter @workspace/cloudscale run dev
```

Open `http://localhost:5173`. The Vite development server proxies `/api` to the API. If the API is stopped or unreachable, the frontend falls back to the local simulator and keeps its traffic-spike and baseline controls working. To exercise fallback, stop the API process and reload the dashboard.

For package checks, run `pnpm --filter @workspace/api-server run typecheck`, `pnpm --filter @workspace/cloudscale run typecheck`, and `pnpm --filter @workspace/cloudscale run build` from the repository root.

The current production Docker image serves static frontend files through Nginx and does not run or proxy to the API. It cannot currently serve both the frontend and API: the Nginx config only serves the SPA and its fallback can return `index.html` for an `/api` request.

When containerizing the full application, add a separate API image that runs the built Express server on port 3000, wire it and Nginx onto the same container network (or add equivalent `/api` routing at the load balancer), and make Nginx forward `/api/` to the API instead of the SPA fallback. Add an API health check at `/api/health` and set runtime routing for the deployed environment. Keep the frontend image serving the static build on port 80. No Docker or Nginx deployment files have been changed in this phase.
