
# Alex Portfolio — Frontend

The Next.js application for Alex Gustilo's personal developer portfolio. It contains the public portfolio homepage and the current administrator interface.

## Technology

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework and routing |
| React 19 | UI |
| TypeScript | Application types |
| Tailwind CSS 4 | Styling |
| Lucide React | Interface icons |
| ESLint 9 | Linting |
| FastAPI | Backend REST API |

The frontend communicates with FastAPI. It does **not** connect directly to Supabase.

## Current functionality

### Public portfolio
- Single-page homepage with Hero, About, Skills, Projects, Certificates, Journey, and Contact sections.
- Navbar links to page sections and a footer.
- Public section content is currently imported from `src/lib/data.ts` (static local data).
- The Contact section currently displays a `mailto:` link; it does not submit to the backend contact endpoint.

### Admin
- `/admin/login`: login form connected to the FastAPI authentication endpoint.
- `/admin/dashboard`: loads project, certificate, skill, unread-message counts, and the administrator profile from the API.
- `/admin/projects`: project listing and create/edit/delete interface, including project-image upload and removal.
- Shared admin sidebar and header layout.
- The protected layout checks the current session through `GET /auth/me` and verifies `app_metadata.role === "admin"`.

The sidebar also contains links for Skills, Certificates, Messages, and Profile, but corresponding working management pages are not present in this code snapshot. Do not treat those screens as implemented yet.

## Repository structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   └── (protected)/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/layout/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── shared/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── data.ts
│   ├── hooks/
│   └── types/
├── docs/
├── package.json
└── README.md
```

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- The FastAPI backend and configured Supabase project for API-backed admin features

## Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This is the only frontend environment variable required by the current code. The API client falls back to this local URL when the variable is absent.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

Available scripts:

```bash
npm run lint
npm run build
npm run start
```

Run lint/build at suitable verification points (for example, before a release or after a group of related changes), rather than automatically after every small edit.

## Authentication and API notes

- `src/lib/api.ts` centralizes HTTP requests, JSON/FormData handling, Bearer token attachment, and API errors.
- `src/lib/auth.ts` handles login, refresh, current-user lookup, and logout API calls.
- The access and refresh tokens are stored in browser `sessionStorage`.
- This is a client-side session implementation. It is not an HttpOnly-cookie/server-rendered authentication design.
- Backend endpoints must enforce authorization independently; hiding or guarding frontend pages is not a security boundary.
- Never put Supabase service-role credentials or other private secrets in frontend environment variables.

## Documentation

- [Admin interface](docs/ADMIN.md)
- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Components](docs/COMPONENTS.md)
- [Development workflow](docs/DEVELOPMENT.md)
- [Styling](docs/STYLING.md)

## Implementation status

| Area | Current status |
|---|---|
| Public homepage and sections | Implemented; content is static |
| FastAPI request helper | Implemented |
| Admin login | Implemented against API |
| Protected admin layout | Client-side API session check |
| Dashboard API statistics | Implemented |
| Project CRUD UI | Implemented; verify each operation in the target environment |
| Project image upload/delete integration | Implemented for project images |
| Skills admin page | Implemented; CRUD interface available |
| Certificates admin page | Implemented; CRUD and certificate image upload/delete |
| Messages admin page | Deferred; no management page currently implemented |
| Profile admin page | Implemented; profile display and name update; avatar upload pending |
| Public content from API | Not integrated |
| Contact form submission | Not integrated; current section uses mailto |
| Production deployment | Not verified |

## Deployment

Fly.io is the planned deployment platform, not a verified deployment in this snapshot. Configure the production `NEXT_PUBLIC_API_URL` to the deployed backend URL and configure backend CORS to allow the deployed frontend origin.
