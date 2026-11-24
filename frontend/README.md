# Alex Portfolio — Frontend

The Next.js application for Alex Gustilo's personal developer portfolio. It contains the public portfolio homepage and the administrator interface.

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

The frontend communicates with FastAPI. It does not connect directly to Supabase.

## Current functionality

### Public portfolio

- Single-page homepage with Hero, About, Skills, Projects, Certificates, Journey, and Contact sections.
- Responsive navbar and footer.
- Public route is organized under `src/app/(public)/`; the URL remains `/`.
- Public section components are located in `src/components/public/`.
- Public section content is currently imported from `src/lib/data.ts` (static local data).
- The Contact section currently displays a mail link; it does not submit to the backend contact endpoint.

### Admin

- `/admin/login`: login form connected to the FastAPI authentication endpoint.
- `/admin/dashboard`: loads project, certificate, skill, unread-message counts, and administrator profile information.
- `/admin/projects`: project management, including project-image upload and removal.
- `/admin/skills`: skills management.
- `/admin/certificates`: certificate management, including certificate-image upload and removal.
- `/admin/profile`: administrator profile information, name updates, and avatar upload/removal.
- Shared Admin sidebar and header layout.
- Protected layout checks the current session through the authentication API and verifies the administrator role.

The Dashboard's unread-message count uses the existing Messages API endpoint. The Messages management interface itself remains deferred.

## Repository structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   └── (protected)/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── skills/
│   │   │       ├── certificates/
│   │   │       └── profile/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── features/
│   │   └── dashboard/
│   │       ├── components/
│   │       ├── services/
│   │       └── types/
│   ├── components/
│   │   ├── public/
│   │   │   ├── layout/
│   │   │   └── sections/
│   │   ├── admin/
│   │   │   └── layout/
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

The Dashboard is the first feature organized using feature-based architecture. Other Admin features remain in their existing route-level implementations while refactoring is pending.

## Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- FastAPI backend and configured Supabase project for API-backed Admin features.

## Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This is the environment variable required by the current frontend API client. The API client falls back to the local URL when the variable is absent.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Available scripts:

```bash
npm run lint
npm run build
npm run start
```

Run lint/build at suitable verification points, such as before a release or after a group of related changes, rather than automatically after every small edit.

## Authentication and API notes

- `src/lib/api.ts` centralizes HTTP requests, JSON/FormData handling, Bearer token attachment, and API errors.
- `src/lib/auth.ts` handles login, refresh, current-user lookup, and logout API calls.
- Access and refresh tokens are stored in browser session storage.
- This is a client-side session implementation, not an HttpOnly-cookie/server-rendered authentication design.
- Backend endpoints must enforce authorization independently; frontend route guards are not a security boundary.
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
| Public route group organization | Implemented |
| Shared FastAPI request helper | Implemented |
| Admin login | Implemented against API |
| Protected Admin layout | Client-side session and role check |
| Dashboard API statistics | Implemented; feature-based refactoring started |
| Project CRUD UI | Implemented |
| Project image upload/delete integration | Implemented |
| Skills Admin page | Implemented |
| Certificates Admin page | Implemented |
| Certificate image upload/delete integration | Implemented |
| Profile information and name update | Implemented |
| Profile avatar upload/removal | Implemented |
| Messages management interface | Deferred; Dashboard unread count remains integrated |
| Public content from API | Not integrated |
| Contact form submission | Not integrated; current section uses a mail link |
| Other Admin feature-based refactoring | Pending |
| Backend structural refactoring | Pending |
| Production deployment | Not verified |

## Deployment

Fly.io is the planned deployment platform, not a verified deployment in this snapshot.

Configure the production `NEXT_PUBLIC_API_URL` to the deployed backend URL and configure backend CORS to allow the deployed frontend origin.
