# NaniTechOS Webapp

A desktop-inspired SPA that blends a windowed UX (top bar, dock, draggable windows) with server-backed content, services, and activity tracking. Built with React, Vite, Tailwind, Framer Motion, and an Express + Drizzle/Postgres backend.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Environment](#environment)
- [Scripts](#scripts)
- [API Routes](#api-routes)
- [Data Model](#data-model)
- [Desktop UX](#desktop-ux)
- [Theming](#theming)
- [Services Window](#services-window)
- [Activity Bin](#activity-bin)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features
- Desktop metaphor: top bar, dock, draggable/resizable windows (NaniVault, Launchpad, NaniAssist, Settings, Services, Activity Bin).
- Content-driven panes (story/mission/team/values) powered by `/api/content`.
- New Services window: animated service cards with gradients and motion.
- New Activity Bin: last 10 activities, clear/stop/auto-clear controls, animated “live pulse” viz.
- Custom wallpaper: centered Nanitech logo, preserved background.
- Toasts, tooltips, and window controls styled to brand palette.

## Tech Stack
- Client: React 18, Vite 7, TypeScript, Tailwind 3, Radix UI primitives, Framer Motion, Wouter, React Query.
- Server: Node/Express (ESM), Drizzle ORM, Postgres (pg) or Neon serverless (auto-select based on `DATABASE_URL`), dotenv, Swagger ready.
- Build: Vite for client; esbuild (ESM bundle) for server; tsx for dev execution.
- Auth (dev): mock Firebase allowed via `ALLOW_MOCK_FIREBASE=true`; real Firebase can be wired later.

## Architecture
- Monorepo structure:
  - `client/` — React app (entry `client/src/main.tsx`, root layout `App.tsx`, desktop shell `components/Desktop.tsx`).
  - `server/` — Express app (`server/index.ts`), routes (`server/routes.ts`), DB (`server/db.ts`), seed data (`server/seed.ts`).
  - `shared/` — Schema shared between client/server (Drizzle models).
- Express mounts routes directly (no sub-router nesting); Vite dev server proxied by the client scripts.

## Environment
Create `.env` in project root:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
PORT=5000
ALLOW_MOCK_FIREBASE=true   # dev only
```
- If `DATABASE_URL` contains `localhost`/`127.0.0.1`, backend uses `pg` client; otherwise Neon serverless with websockets.
- In dev, mock Firebase is used; in prod, ensure Firebase Admin SDK is configured or disable the mock.

## Scripts
- `npm run dev` — Starts server (tsx) and Vite client concurrently (proxy).  
- `npm run build` — Vite build + esbuild bundling `server/index.ts` to `dist/`.  
- `npm start` — Runs bundled server (`dist/index.js`).  
- `npm run check` — TypeScript type-check.  
- `npm run db:push` — Drizzle migrations push.

## API Routes (server/routes.ts)
- GET `/api/company-info` — Static company info (story, team, values, mission).
- GET `/api/launchpad-apps` — Launchpad tiles.
- GET `/api/search-apps?q=` — Filter launchpad apps.
- POST `/api/contact` — Accepts {name,email,message,type}; stubbed success.
- GET `/api/settings` / POST `/api/settings` — Returns/accepts OS-like settings (stubbed persistence).
- GET `/api/search?q=` — Global search across content + static team/values; returns mapped URLs and snippets.
- Content CRUD:
  - GET `/api/content` — All content.
  - GET `/api/content/:id`
  - POST `/api/content`
  - PUT `/api/content/:id`
  - DELETE `/api/content/:id`
- Wallpapers:
  - GET `/api/wallpapers`
  - POST `/api/wallpapers`
  - DELETE `/api/wallpapers/:id`
- Apps:
  - GET `/api/apps`
  - POST `/api/apps`
  - PUT `/api/apps/:id`
  - DELETE `/api/apps/:id`
- Users (demo):
  - GET `/api/users`
  - POST `/api/users`
  - POST `/api/login` (simple username/password check)
- Health:
  - GET `/health`
  - GET `/api/metrics` (stub counts)

## Data Model (shared/schema)
- `users` (id, username, password)
- `apps` (id, name, icon, position, visible, windowSettings)
- `wallpapers` (id, name, url, category, isDefault)
- `settings` (userId, UI prefs)
- `content` (id, type, title, description, content, imageUrl, category)

## Desktop UX
- Windows: draggable, z-index managed, minimize/maximize/restore, auto-maximized on mobile.
- Dock: centered, blurred pill, hover scale; tooltips now white.
- Top Bar: gradient + blur, larger logo, bold label; clock, search, control panel.
- Wallpaper: Nanitech logo centered, contain-fit, no-repeat; background otherwise unchanged.

## Theming
- Palette: primary #2a3d52, secondary #3c6382, accent #00a8ff, dark #1a2634, light #f5f6fa, success #2ed573, error #ff4757, warning #ffa502.
- Text: body uses warning color; headings (h1–h6) forced white; icons default to error red.
- Toasts: white text for default and destructive variants; white close icon.
- Gradients: top bar dark gradient; services cards with hue-tinted gradients; activity pulse with warning→error.

## Services Window (client/src/apps/Services.tsx)
- Grid of animated cards (Framer Motion), each with icon capsule, gradient background, shadows.
- Services covered: AI Product Design, Platform Modernization, Data & Analytics, DevOps & Reliability, Product Advisory.
- Badges: “Specialist delivery pods”, “Week-long progress demos”.

## Activity Bin (client/src/apps/ActivityBin.tsx)
- Two-pane layout:
  - Timeline of last 10 activities (glass cards, animated entry, timestamps, user labels).
  - Live pulse viz: animated gradient bars reflecting recency.
- Controls: Stop/Resume tracking, Clear Activity, Auto-clear on close (persisted).
- Storage: localStorage (`nanios_activity_log`), seeded sample if empty.

## Development Notes
- Vite dev port 5173; server default port 5000 (set PORT to change). If port in use, update `server/index.ts` or export PORT.
- Mock Firebase used in dev to avoid admin SDK setup; disable in prod.
- Seeds: `server/seed.ts` auto-runs on start; includes “Our Mission”, “Our Story”, wallpapers, apps, settings.

## Troubleshooting
- `EADDRINUSE` on port 5000: stop the conflicting process or set `PORT=3001` (and adjust client proxy if needed).
- `DATABASE_URL must be set`: add to `.env`.
- `role "postgres" does not exist`: create the DB role or adjust `DATABASE_URL` credentials.
- Mock Firebase message: expected in dev when no Firebase creds.
- Content missing: ensure `/api/content` returns rows; seed runs on boot if not already seeded.
