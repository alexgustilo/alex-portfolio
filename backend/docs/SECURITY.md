# Backend Security Notes

This document describes the security controls implemented or expected by the current backend. It does not certify that the deployed Supabase project or production environment has been audited.

## Authentication

- Supabase Auth handles administrator sign-in and token refresh.
- Protected routes validate the supplied access token through Supabase Auth.
- `get_current_user` provides the authenticated user.
- `get_current_admin` additionally requires `app_metadata.role == "admin"`.
- The administrator role is read from server-controlled Supabase `app_metadata`, not user-editable profile fields.

The frontend must send a valid access token using the Bearer Authorization header when accessing protected endpoints.

## Authorization

Administrator authorization is enforced by backend dependencies, not only by frontend navigation or layout restrictions.

Current administrator-protected operations include:

- Project creation, updates, and deletion.
- Skill creation, updates, and deletion.
- Certificate creation, updates, and deletion.
- Message management.
- Administrator profile operations.
- Project image uploads and deletion.
- Certificate image uploads and deletion.
- Administrator avatar uploads and deletion.

Public read endpoints and public contact submissions have different access requirements. Refer to `API.md` for endpoint-level access information.

The frontend's protected routes are a user-interface safeguard and must never replace backend authorization.

## Secret management

Backend environment variables include:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key grants privileged Supabase access and must remain server-side.

Security practices:

- Keep `.env` out of Git.
- Never put the service-role key in `NEXT_PUBLIC_` variables.
- Never expose credentials in browser code, logs, screenshots, or documentation examples.
- Do not commit access tokens, refresh tokens, or passwords.
- Rotate credentials if they are exposed.

`SUPABASE_SERVICE_ROLE_KEY` is optional during settings initialization, but privileged operations through `get_admin_supabase()` require it. Missing privileged configuration results in an HTTP 503 response.

## Supabase clients and database access

The backend uses separate Supabase clients:

- The regular client uses the configured public/publishable key.
- The privileged client uses the service-role key for server-side operations.

Configure Supabase Row Level Security policies appropriate to the application and its public client.

Verify that public client access cannot modify administrator-managed records or expose private information. Do not assume that using a backend service automatically makes database policies safe.

## CORS

`CORS_ORIGINS` is a comma-separated allowlist of permitted frontend origins.

Set it to the actual origins required by each environment. Avoid broad wildcard origins when credentials are enabled.

## Image upload controls

Project, certificate, and avatar uploads share the same validation process.

The upload route:

- Requires administrator authorization.
- Accepts only JPG/JPEG, PNG, and WebP extensions.
- Checks the declared MIME type against the extension.
- Checks the binary signature of the uploaded content.
- Rejects empty files.
- Limits uploaded content to 5 MiB.
- Generates UUID-based filenames instead of trusting user-supplied filenames.
- Closes the uploaded file after processing.

### Storage separation

| Image type | Bucket | Folder |
|---|---|---|
| Project | `portfolio-projects` | `projects/` |
| Certificate | `portfolio-certificates` | `certificates/` |
| Administrator avatar | `portfolio-avatars` | `avatars/` |

The upload services use the privileged Supabase client.

### Deletion restrictions

Deletion routes require administrator authorization and restrict paths to a single filename inside the designated folder.

- Project deletion is restricted to `projects/`.
- Certificate deletion is restricted to `certificates/`.
- Avatar deletion is restricted to `avatars/`.

These restrictions prevent the corresponding endpoints from accepting arbitrary paths outside their intended folders.

### Public image access

The upload service returns public image URLs.

If a bucket is configured for public reads, anyone with the URL may be able to view its images. Do not upload private or sensitive images to publicly accessible buckets.

Public image visibility does not make upload or deletion operations public; those operations remain protected by backend authorization.

## Contact and message data

Contact submissions are accepted through the public contact endpoint and stored in the `contact_messages` table.

Message-management endpoints require administrator authorization.

Protect contact and message data through appropriate database policies and access controls. Avoid exposing visitor messages through public endpoints or logging their contents unnecessarily.

## Frontend session limitation

The current frontend stores access and refresh tokens in `sessionStorage`.

Because `sessionStorage` is accessible to JavaScript running in the page, tokens may be exposed if malicious JavaScript executes in the application.

This is less protective than an HttpOnly cookie-based session design.

Consider migrating to server-managed cookies with appropriate `HttpOnly`, `Secure`, and `SameSite` settings before production. Such a migration requires coordinated frontend and backend changes.

## Operational safeguards

- Use HTTPS in production.
- Apply least-privilege access to Supabase resources.
- Verify Row Level Security policies.
- Avoid returning internal exception details to public clients.
- Do not expose private profile or visitor message data through public endpoints.
- Protect and back up contact-message data.
- Monitor failed authentication and privileged operations.
- Rotate exposed credentials promptly.
- Keep development and production credentials separate.

These recommendations describe required safeguards and known implementation characteristics. They do not confirm that every production configuration has been tested.
