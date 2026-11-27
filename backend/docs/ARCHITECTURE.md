# Backend Architecture

## Overview

The backend is a FastAPI application organized around feature-based modules.

Each feature contains its own route handlers, Pydantic schemas, and service functions. Shared infrastructure remains in the `core/` and `dependencies/` packages.

The Messages implementation remains in the original `routes/`, `schemas/`, and `services/` packages.

## Project structure

```text
backend/
├── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── supabase.py
│   ├── dependencies/
│   │   └── auth.py
│   ├── features/
│   │   ├── auth/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── certificates/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── contact/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── profile/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── projects/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── skills/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   └── uploads/
│   │       ├── routes.py
│   │       ├── schemas.py
│   │       └── service.py
│   ├── routes/
│   │   └── messages.py
│   ├── schemas/
│   │   └── messages.py
│   ├── services/
│   │   └── message_service.py
│   └── main.py
├── docs/
├── requirements.txt
└── .env
```

Each Python package also contains its appropriate `__init__.py` file.

## Feature modules

The `features/` package contains the following modules:

| Feature | Responsibility |
|---|---|
| `auth/` | Administrator login, refresh, current-user, and logout endpoints |
| `profile/` | Administrator profile retrieval and updates |
| `projects/` | Portfolio project operations |
| `skills/` | Portfolio skill operations |
| `certificates/` | Certificate operations |
| `contact/` | Public contact submissions |
| `uploads/` | Project, certificate, and avatar image uploads and deletion |

Each feature separates its responsibilities:

- `routes.py`: API endpoints, HTTP handling, and dependencies.
- `schemas.py`: request validation and response models.
- `service.py`: feature-specific business operations and Supabase interactions.

## Messages module

Messages remains separated from the migrated feature modules:

- `routes/messages.py`: message API endpoints.
- `schemas/messages.py`: message request and response schemas.
- `services/message_service.py`: message data operations.

The Messages module is registered directly by `main.py`. Its existing implementation and API behavior are preserved.

## Request flow

Typical request flow:

`HTTP request → main.py router → feature route → authentication dependency (when required) → schema validation → service → Supabase → HTTP response`

The exact flow depends on the endpoint. Public endpoints do not require administrator authentication.

## Application entry point

`main.py` is responsible for:

- Creating the FastAPI application.
- Configuring CORS middleware.
- Registering feature routers.
- Registering the Messages router.
- Exposing the root and health endpoints.

All application feature routers are registered under the configured API prefix, normally `/api/v1`.

## Shared infrastructure

### Core configuration

`core/config.py` loads environment-backed application settings, including the application name, version, environment, API prefix, CORS origins, and Supabase configuration.

### Authentication dependencies

`dependencies/auth.py` provides shared authentication dependencies:

- `get_current_user`: validates the Supabase access token.
- `get_current_admin`: requires the administrator role.

### Security utilities

`core/security.py` contains shared security-related checks, including trusted administrator-role verification.

### Supabase clients

`core/supabase.py` provides the regular and privileged Supabase clients.

- `get_supabase()` uses the configured public/publishable key.
- `get_admin_supabase()` uses the server-side service-role key.

The service-role key must never be exposed to frontend code.

## Supabase data

The current service implementation expects these database tables:

- `projects`
- `skills`
- `certificates`
- `contact_messages`
- `profiles`

Database migrations and SQL schema definitions are not included in this project snapshot.

## Supabase Storage

The upload feature uses three dedicated buckets:

| Image type | Bucket | Folder |
|---|---|---|
| Project images | `portfolio-projects` | `projects/` |
| Certificate images | `portfolio-certificates` | `certificates/` |
| Administrator avatars | `portfolio-avatars` | `avatars/` |

Uploads and deletions require administrator authorization. The upload routes validate image extensions, MIME types, binary signatures, and file size before using the Storage services.

## Frontend integration

The application follows this integration boundary:

`Next.js frontend → FastAPI backend → Supabase`

The frontend communicates with the backend through the configured API base URL. Privileged Supabase operations remain server-side.

Public portfolio sections may use frontend data independently of the backend public-read endpoints. Do not assume every public endpoint is already integrated into the frontend.
