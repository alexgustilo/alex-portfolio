
# Frontend Architecture

## Application structure

The application uses the Next.js App Router.

- `src/app`: route entry points and root styles/layout.
- `src/components/layout`: public navbar and footer.
- `src/components/sections`: public portfolio sections.
- `src/components/admin/layout`: administrator header and sidebar.
- `src/components/shared`: reusable presentation components.
- `src/lib/data.ts`: static public portfolio content.
- `src/lib/api.ts`: shared FastAPI HTTP client.
- `src/lib/auth.ts`: administrator authentication helpers.
- `src/types` and `src/hooks`: reserved organization areas; inspect current contents before assuming a feature exists.

## Routes

- `/`: public one-page portfolio.
- `/admin/login`: administrator login.
- `/admin/dashboard`: protected dashboard.
- `/admin/projects`: protected project management.

The admin sidebar also links to skills, certificates, messages, and profile, but their page implementations are absent from this snapshot.

## Data flow

### Public website

Current public section flow:

`Next.js page/components → src/lib/data.ts`

The public sections do not currently fetch projects, skills, or certificates from FastAPI. Their displayed content is local/static.

The Contact section currently links to a `mailto:` address placeholder. It does not call `POST /api/v1/contact`.

### Admin

`Admin page → src/lib/api.ts → FastAPI REST API → Supabase`

The frontend sends Bearer access tokens for authenticated requests. FastAPI verifies the token and performs role checks before privileged operations.

### Image upload

`Project form → multipart request → FastAPI upload route → Supabase Storage`

The upload route uses the `portfolio-projects` bucket and returns a public image URL plus a storage path.

## Session handling

`api.ts` stores tokens in browser `sessionStorage` and adds the access token to API requests. `auth.ts` wraps login, refresh, current-user, and logout endpoints.

The protected layout performs a client-side `/auth/me` check. This design does not provide server-side route protection and should be hardened before production, preferably with a server-managed HttpOnly cookie approach.

## Configuration

The frontend reads `NEXT_PUBLIC_API_URL`. Do not add Supabase private credentials to the frontend. The local default is `http://localhost:8000/api/v1`.
