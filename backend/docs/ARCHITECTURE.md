
# Backend Architecture

## Overview

The backend is a FastAPI application organized into routes, schemas, services, dependencies, and core configuration.

## Request flow

Typical API request:

`HTTP request → FastAPI route → dependency/auth check → Pydantic schema → service → Supabase → response`

- `routes/`: HTTP methods, URL paths, dependency declarations, and response handling.
- `schemas/`: request validation and response models.
- `services/`: database and Storage operations.
- `dependencies/auth.py`: Bearer token extraction, Supabase user validation, and admin dependency.
- `core/config.py`: environment-backed settings.
- `core/security.py`: trusted admin-role check.
- `core/supabase.py`: cached regular and privileged Supabase clients.
- `main.py`: FastAPI app, CORS middleware, and router registration.

## Supabase clients

### Regular client

`get_supabase()` uses the Supabase URL and publishable/anon key. It is used for public reads and public contact submissions, and for validating user access tokens through Supabase Auth.

### Privileged client

`get_admin_supabase()` uses `SUPABASE_SERVICE_ROLE_KEY`. It is used by protected services for administrator data operations and project-image Storage operations. It raises HTTP 503 when the key is not configured.

The privileged key must remain server-side.

## Authentication and authorization

1. The client sends a Supabase access token in the Bearer Authorization header.
2. `get_current_user` validates the token with Supabase Auth.
3. `get_current_admin` additionally checks `app_metadata.role == "admin"`.
4. Protected routes use the admin dependency before performing privileged operations.

The admin role is read from Supabase `app_metadata`, which is server-controlled. Do not trust a role value submitted by a browser.

## Data services

Portfolio tables used by the service layer:

- `projects`
- `skills`
- `certificates`
- `contact_messages`
- `profiles`

The code expects these tables and their columns to exist in the Supabase database. The application repository does not include database migrations or SQL schema definitions in this snapshot.

## Storage service

Project images are stored in the `portfolio-projects` bucket, and certificate images are stored in the `portfolio-certificates` bucket. `routes/uploads.py` validates uploads and restricts deletion to the corresponding `projects/` or `certificates/` folder. `services/upload_service.py` uses the privileged Supabase client to upload and remove objects.

Profile avatar upload is not currently implemented. The profile API only handles profile data, including an optional `avatar_url` field.

The API returns a public URL for display. The bucket's public-read configuration must be set appropriately in Supabase for unauthenticated image display. Upload and deletion remain protected by FastAPI admin authorization.

## Frontend integration boundary

The intended flow is:

`Next.js frontend → FastAPI → Supabase`

The frontend must not connect using the service-role key. Public portfolio sections currently use static frontend data; the backend's public read endpoints are not yet wired into those sections.
