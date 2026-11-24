
# Frontend Development Guide

## Requirements

- Node.js compatible with Next.js 16
- npm
- FastAPI backend for admin/API features

## Install and run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

Run the backend separately from the `backend/` directory so the frontend can reach `http://localhost:8000`.

## Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This is the environment variable referenced by the current frontend code. Supabase URL and Supabase keys are not read by the frontend API/auth modules.

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

Run lint/build during planned verification (for example, after completing a feature group or before pushing a release). For small iterative UI changes, test the affected page and relevant user flow first.

## Current API integration

- `src/lib/api.ts` is the shared request helper.
- `src/lib/auth.ts` provides login, refresh, current-admin, and logout helpers.
- Admin API requests attach the access token from `sessionStorage`.
- Admin management pages currently cover Projects, Skills, and Certificates. Profile supports displaying account information and updating the full name.
- Certificate image operations use the `/uploads/certificates` endpoints. Profile avatar upload is not yet available.
- FormData requests do not set `Content-Type` manually, allowing the browser to add the multipart boundary.
- The current public portfolio content remains local/static in `src/lib/data.ts`.

## Suggested workflow

1. Inspect the existing page, component, and styles.
2. Identify the backend endpoint and schema before adding API integration.
3. Make focused changes and preserve existing behavior.
4. Run the affected page and test the relevant user flow.
5. Review `git diff` and `git status`.
6. Run lint/build at a suitable milestone or before a release.
7. Commit only the intended files.

## Git hygiene

- Keep commits focused and descriptive.
- Do not commit `.env.local`, `node_modules/`, or `.next/`.
- Review staged changes before every commit.
