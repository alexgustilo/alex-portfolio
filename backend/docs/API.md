# API Reference

## Overview

The Alex Portfolio API is built with FastAPI.

Base URL during local development:

`http://localhost:8000`

API prefix:

`/api/v1`

All endpoints are registered in `app/main.py`.

## API Documentation Interface

Interactive documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Authentication Requirements

Public endpoints do not require an access token.

Administrator endpoints require:

`Authorization: Bearer <access_token>`

The backend verifies the token using Supabase Auth and checks the trusted `app_metadata.role` for the `admin` value.

Use the Swagger **Authorize** control to provide an access token when testing protected endpoints.

## 1. Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | API information |
| GET | `/health` | Public | Application health check |

## 2. Authentication

Prefix: `/api/v1/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Authenticate an administrator |
| POST | `/refresh` | Public | Refresh an authentication session |
| GET | `/me` | Authenticated | Retrieve the current user |
| POST | `/logout` | Authenticated | Sign out the current session |

### Login request

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

The login operation checks the authenticated user's trusted admin role before returning the session.

### Refresh request

```json
{
  "refresh_token": "your-refresh-token"
}
```

### Current user

Requires a valid Bearer access token.

### Logout

Requires the current session's Bearer access token.

## 3. Projects

Prefix: `/api/v1/projects`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Retrieve all projects |
| GET | `/{project_id}` | Public | Retrieve a project |
| POST | `/` | Admin | Create a project |
| PATCH | `/{project_id}` | Admin | Update a project |
| DELETE | `/{project_id}` | Admin | Delete a project |

### Create project request

```json
{
  "title": "Portfolio API Test Project",
  "description": "A sample portfolio project.",
  "image_url": null,
  "live_url": null,
  "github_url": "https://github.com/alexgustilo",
  "technologies": [
    "Next.js",
    "FastAPI",
    "Supabase"
  ],
  "featured": false,
  "display_order": 1
}
```

Project identifiers are UUID values.

## 4. Skills

Prefix: `/api/v1/skills`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Retrieve all skills |
| GET | `/{skill_id}` | Public | Retrieve one skill |
| POST | `/` | Admin | Create a skill |
| PATCH | `/{skill_id}` | Admin | Update a skill |
| DELETE | `/{skill_id}` | Admin | Delete a skill |

### Create skill request

```json
{
  "name": "Python",
  "category": "Backend",
  "proficiency": 75,
  "icon": null,
  "display_order": 1
}
```

Proficiency must be between 0 and 100.

## 5. Certificates

Prefix: `/api/v1/certificates`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Retrieve all certificates |
| GET | `/{certificate_id}` | Public | Retrieve a certificate |
| POST | `/` | Admin | Create a certificate |
| PATCH | `/{certificate_id}` | Admin | Update a certificate |
| DELETE | `/{certificate_id}` | Admin | Delete a certificate |

### Create certificate request

```json
{
  "title": "Python Bootcamp",
  "issuer": "Example Organization",
  "issue_date": "2026-01-01",
  "credential_url": null,
  "image_url": null,
  "description": "Certificate description.",
  "display_order": 1
}
```

The issue date uses the `YYYY-MM-DD` format.

## 6. Contact

Prefix: `/api/v1/contact`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit a contact message |

### Contact request

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project inquiry",
  "message": "Hello, I would like to discuss a project."
}
```

The API saves the message in `contact_messages`.

If SMTP is configured, the backend attempts to send an email notification. The response indicates whether that notification was sent.

## 7. Messages

Prefix: `/api/v1/messages`

All message management operations require administrator authorization.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve messages |
| GET | `/{message_id}` | Retrieve a specific message |
| PATCH | `/{message_id}` | Update message status |
| DELETE | `/{message_id}` | Delete a message |

Optional filter:

`GET /api/v1/messages/?status=unread`

Allowed statuses:

- `unread`
- `read`
- `replied`
- `archived`

### Update message request

```json
{
  "status": "read"
}
```

## 8. Profile

Prefix: `/api/v1/profile`

Administrator authorization is required.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/me` | Retrieve the current administrator profile |
| PATCH | `/me` | Update the current administrator profile |

### Update profile request

```json
{
  "full_name": "Alex Gustilo",
  "avatar_url": null
}
```

The profile ID is associated with the authenticated Supabase user.

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 204 | Resource deleted successfully |
| 400 | Invalid request |
| 401 | Authentication required or invalid |
| 403 | Administrator access required |
| 404 | Resource not found |
| 422 | Request validation failed |
| 500 | Unexpected server error |
| 503 | Required backend service configuration unavailable |

## Notes

- Public portfolio reads use the regular Supabase client.
- Administrator writes use the privileged backend client after admin authorization.
- A successful application import does not prove that database operations work.
- All CRUD operations still require end-to-end testing against the configured Supabase project.
