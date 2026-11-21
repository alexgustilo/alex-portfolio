# Backend Architecture

## Overview

The Alex Portfolio backend uses FastAPI and Supabase.

The application separates HTTP routes, request validation, business logic, configuration, authentication dependencies, and database access.

## System Architecture

```text
Next.js Frontend
       |
       | HTTP requests
       v
FastAPI Application
       |
       +----------------------+
       |                      |
       v                      v
    Public Routes        Admin Routes
       |                      |
       v                      v
    Schemas               Authentication
       |                      |
       v                      v
    Services             Admin Authorization
       |                      |
       +-----------+----------+
                   |
                   v
             Supabase Client
                   |
          +--------+--------+
          |                 |
          v                 v
      PostgreSQL        Supabase Auth
```

## Application Layers

### 1. Main Application

File: `app/main.py`

Responsibilities:

- Create the FastAPI application.
- Configure CORS.
- Register API routers.
- Define application health endpoints.

### 2. Core

Directory: `app/core/`

#### config.py

Defines application settings and loads environment variables using Pydantic Settings.

#### supabase.py

Creates two separate clients:

- Public client using the publishable/anonymous key.
- Privileged server client using the backend secret key.

The privileged client must only be used by server-side operations that already verify admin authorization.

#### security.py

Checks whether the authenticated Supabase user has the trusted administrator role in `app_metadata`.

### 3. Dependencies

Directory: `app/dependencies/`

#### auth.py

Provides reusable authentication dependencies:

- `get_current_user`
- `get_current_admin`

The current user dependency validates a supplied Bearer token through Supabase Auth.

The admin dependency checks the authenticated user's administrator role.

### 4. Routes

Directory: `app/routes/`

Routes receive HTTP requests and return API responses.

Current modules:

- `auth.py`
- `projects.py`
- `skills.py`
- `certificates.py`
- `contact.py`
- `messages.py`
- `profile.py`

Routes should not contain large amounts of database or business logic.

### 5. Schemas

Directory: `app/schemas/`

Schemas define and validate request and response data using Pydantic.

Current modules:

- `auth.py`
- `projects.py`
- `skills.py`
- `certificates.py`
- `contact.py`
- `messages.py`
- `profile.py`

### 6. Services

Directory: `app/services/`

Services contain database and application operations.

Current modules:

- `auth_service.py`
- `project_service.py`
- `skill_service.py`
- `certificate_service.py`
- `contact_service.py`
- `message_service.py`
- `profile_service.py`

## Request Flow

### Public Portfolio Read

1. The frontend requests public portfolio information.
2. A route receives the request.
3. The service queries Supabase using the public client.
4. The result is returned through the API response.

### Administrator Write

1. The administrator signs in through Supabase Auth.
2. The frontend receives an access token.
3. The frontend sends the token as a Bearer token.
4. FastAPI verifies the token.
5. The admin dependency verifies the trusted admin role.
6. The route validates the submitted data through a Pydantic schema.
7. The service performs the requested database operation.
8. The API returns the result.

### Contact Submission

1. A visitor submits the contact form.
2. The Contact route validates the request.
3. The Contact service inserts the message into Supabase.
4. The API returns a submission confirmation.

## API Versioning

The current API prefix is:

`/api/v1`

The prefix is configured through the `API_PREFIX` environment variable and applied when registering the routers in `main.py`.

## Database

The backend uses these existing Supabase tables:

- `profiles`
- `projects`
- `skills`
- `certificates`
- `contact_messages`

## Implementation Notes

The application modules are implemented in code, but database integration and authorization must still be tested end to end.

Production architecture must also be reviewed for secret handling, database policies, error handling, and deployment configuration.
