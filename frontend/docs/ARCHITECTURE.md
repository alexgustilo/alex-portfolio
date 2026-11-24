# Frontend Architecture

## Application structure

The frontend uses Next.js App Router with TypeScript, React, and Tailwind CSS.

- `src/app`: route entry points, layouts, and global styles.
- `src/app/(public)`: public portfolio route group. The route group does not change the URL.
- `src/app/admin`: administrator login and protected management routes.
- `src/components/public/layout`: public navbar and footer.
- `src/components/public/sections`: public portfolio sections.
- `src/components/admin/layout`: administrator header and sidebar.
- `src/components/shared`: reusable components shared across the application.
- `src/features`: feature-specific components, services, and types.
- `src/lib/api.ts`: shared FastAPI HTTP client and session-token helpers.
- `src/lib/auth.ts`: administrator authentication helpers.
- `src/lib/data.ts`: static public portfolio content.
- `src/hooks` and `src/types`: shared organization areas for future use.

The Dashboard is the first feature organized using the feature-based structure. Other Admin pages are still being maintained in their existing route locations while their refactoring is pending.

## Routes

- `/`: public one-page portfolio.
- `/admin/login`: administrator login.
- `/admin/dashboard`: protected dashboard.
- `/admin/projects`: protected project management.
- `/admin/skills`: protected skills management.
- `/admin/certificates`: protected certificate management.
- `/admin/profile`: protected administrator profile.

The Messages management interface is deferred. The Dashboard still requests the unread-message count through the existing API endpoint.

## Feature-based Dashboard structure

The Dashboard feature is organized as follows:

```text
src/features/dashboard/
├── components/
│   ├── dashboard-header.tsx
│   ├── dashboard-overview.tsx
│   └── dashboard-stat-card.tsx
├── services/
│   └── dashboard-service.ts
└── types/
    └── dashboard.ts
```

Responsibilities:

- `components`: Dashboard presentation and reusable UI.
- `services`: Dashboard API requests and data preparation.
- `types`: TypeScript interfaces used by the feature.
- `app/admin/(protected)/dashboard/page.tsx`: composes the feature components and manages page-level loading state.

This structure keeps feature-specific code together and reduces the amount of implementation logic inside route pages.

## Data flow

### Public website

Current public section flow:

`Next.js public page/components → src/lib/data.ts`

The public sections currently use local/static portfolio data. They do not fetch projects, skills, or certificates from FastAPI.

The Contact section currently uses a mail link rather than submitting a contact form to the backend.

### Admin

General API flow:

`Admin page or feature service → src/lib/api.ts → FastAPI REST API → Supabase`

The frontend sends Bearer access tokens for authenticated requests. FastAPI remains responsible for validating authentication and enforcing authorization.

The Dashboard service retrieves:

- Projects
- Certificates
- Technical skills
- Unread message count
- Administrator profile

Each Dashboard request is handled independently so a failed request does not prevent the other available statistics from loading.

### Image uploads

`Admin form → multipart request → FastAPI upload route → Supabase Storage`

Current storage buckets include:

- `portfolio-projects`: project images.
- `portfolio-certificates`: certificate images.
- `portfolio-avatars`: administrator profile avatars.

The backend validates uploaded images and handles Storage operations. The frontend uses the returned public URL and storage path where applicable.

## Session handling

`src/lib/api.ts` manages browser session tokens and attaches the access token to API requests.

`src/lib/auth.ts` provides login, refresh, current-user, and logout helpers.

The protected Admin layout performs a client-side current-user check and verifies the administrator role. This is not server-side route protection. Backend authorization must remain enforced independently.

## Configuration

The frontend reads `NEXT_PUBLIC_API_URL`.

The local default is:

`http://localhost:8000/api/v1`

Do not place Supabase service-role credentials, backend secrets, or other private credentials in frontend environment variables.
