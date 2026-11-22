
# Backend Security Notes

## Authentication

- Supabase Auth handles administrator sign-in and token refresh.
- Protected routes validate the access token through Supabase Auth.
- `get_current_admin` requires `app_metadata.role == "admin"`.
- The role check uses Supabase `app_metadata`, not user-editable profile fields.

## Authorization

Administrator authorization is applied at the API route/dependency layer. The frontend's protected layout is only a user-interface guard and must never replace backend authorization.

Current admin-protected operations include project, skill, certificate, message, profile, and project-image management.

## Secret management

Backend environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key grants privileged access and must only be used by the backend. Keep `.env` out of Git and never include the key in frontend variables, browser code, logs, screenshots, or documentation examples.

`SUPABASE_SERVICE_ROLE_KEY` is optional during settings initialization, but `get_admin_supabase()` returns HTTP 503 when privileged access is attempted without it.

## CORS

`CORS_ORIGINS` is a comma-separated allowlist. Set it to the actual frontend origin(s) for each environment. Avoid broad wildcard origins when credentials are enabled.

## Project image upload controls

The upload route:
- Requires administrator authorization.
- Accepts only JPG/JPEG, PNG, and WebP extensions.
- Checks the declared MIME type against the extension.
- Checks the binary signature for the accepted image formats.
- Limits input to 5 MiB.
- Generates a UUID-based filename rather than using the supplied filename.
- Stores objects under `projects/` in the `portfolio-projects` bucket.
- Restricts deletion to a single filename inside `projects/`.

The API returns a public image URL. Public read access to the bucket means anyone with the URL may be able to view the image; do not upload private or sensitive images. Upload and deletion are still authorized by FastAPI.

## Frontend session limitation

The current frontend stores access and refresh tokens in `sessionStorage`. This is accessible to JavaScript executing in the page and is less protective than an HttpOnly cookie design. Consider migrating to server-managed HttpOnly, Secure, SameSite cookies before production.

## Data and operational safeguards

- Use Supabase Row Level Security policies appropriate to the anon/public client.
- Verify that public client access cannot modify administrator data.
- Keep privileged operations on the server and apply least privilege where possible.
- Avoid returning internal exception details to public clients.
- Do not expose visitor messages or profile data through public endpoints.
- Use HTTPS in production.
- Rotate credentials if they are exposed.
- Back up and protect contact-message data.

These notes describe safeguards visible or required by the current implementation; they do not certify that the Supabase project's policies or deployment configuration have been audited.
