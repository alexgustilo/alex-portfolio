# Frontend Development Guide

## Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- FastAPI backend for Admin and API-backed features.

## Install and run

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Run the backend separately from the `backend/` directory so the frontend can reach `http://localhost:8000`.

## Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This is the environment variable referenced by the current frontend code.

Never put service-role keys, backend secrets, or private credentials in a `NEXT_PUBLIC_` variable.

## Available scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

- `dev`: local development server.
- `lint`: ESLint.
- `build`: production build.
- `start`: serve a production build.

Run lint/build during planned verification, such as after completing a feature group or before a release. For small iterative UI changes, test the affected page and relevant user flow first.

## Current API integration

- `src/lib/api.ts` is the shared HTTP request helper.
- `src/lib/auth.ts` provides login, refresh, current-admin, and logout helpers.
- Admin API requests attach the access token from browser session storage.
- Projects, Skills, and Certificates have Admin management pages.
- Profile supports profile information updates and avatar upload/removal.
- Project images, certificate images, and administrator avatars use their respective backend upload endpoints and Supabase Storage buckets.
- FormData requests do not set `Content-Type` manually, allowing the browser to add the multipart boundary.
- The Dashboard feature service retrieves project, certificate, skill, unread-message, and profile information.
- The Dashboard unread-message count uses the existing `/messages/?status=unread` endpoint. This does not mean the Messages management interface is implemented.
- Public portfolio content remains local/static in `src/lib/data.ts`.

## Current frontend architecture

The public homepage is organized under the `(public)` route group:

- `src/app/(public)/page.tsx`
- `src/components/public/layout/`
- `src/components/public/sections/`

The public route group preserves the homepage URL `/`.

Protected Admin routes remain under `src/app/admin/(protected)/`.

The Dashboard is the first feature refactored into:

```text
src/features/dashboard/
├── components/
├── services/
└── types/
```

Projects, Skills, Certificates, and Profile still use their existing route-level implementations. Their feature-based refactoring is planned.

## Suggested workflow

1. Inspect the existing page, components, service, and styles.
2. Identify the backend endpoint and schema before changing API integration.
3. Make focused changes and preserve existing behavior.
4. Keep feature-specific code inside its feature directory when appropriate.
5. Run the affected page and test the relevant user flow.
6. Review `git diff` and `git status`.
7. Run lint/build at a suitable milestone or before a release.
8. Commit only the intended files.

## Git hygiene

- Keep commits focused and descriptive.
- Do not commit `.env.local`, dependency folders, or generated build output.
- Review staged changes before every commit.
- Do not use destructive Git commands on pending work without reviewing their impact.
