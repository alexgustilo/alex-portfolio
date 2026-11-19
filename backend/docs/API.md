# API Reference

## Overview

The backend exposes REST API endpoints for the Alex Portfolio frontend.

Base URL during local development:

```text
http://127.0.0.1:8000/api/v1
```

## API Documentation Interface

When the FastAPI application is running, use:

- Swagger UI: `/docs`
- ReDoc: `/redoc`

These interfaces display the endpoints registered in the running application.

## Planned API Modules

| Module | Purpose | Access |
|---|---|---|
| Authentication | Admin login and current-user information | Public login / authenticated user |
| Projects | Retrieve and manage portfolio projects | Public read / Admin write |
| Skills | Retrieve and manage technical skills | Public read / Admin write |
| Certificates | Retrieve and manage certificates | Public read / Admin write |
| Contact | Accept visitor messages | Public submission |
| Messages | Review and manage submitted messages | Admin only |
| Dashboard | Portfolio administration statistics | Admin only |
| Profile | Manage Admin profile information | Admin only |

## Planned Endpoint Design

### Authentication

```text
POST /auth/login
GET  /auth/me
POST /auth/logout
```

### Public Portfolio

```text
GET  /projects
GET  /skills
GET  /certificates
POST /contact
```

### Admin Management

```text
GET    /admin/dashboard
GET    /admin/projects
POST   /admin/projects
PATCH  /admin/projects/{id}
DELETE /admin/projects/{id}

GET    /admin/skills
POST   /admin/skills
PATCH  /admin/skills/{id}
DELETE /admin/skills/{id}

GET    /admin/certificates
POST   /admin/certificates
PATCH  /admin/certificates/{id}
DELETE /admin/certificates/{id}

GET    /admin/messages
GET    /admin/messages/{id}
PATCH  /admin/messages/{id}
```

These are planned endpoint paths, not a claim that all endpoints have already been implemented.

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 204 | Request successful with no response body |
| 400 | Invalid request |
| 401 | Authentication required or invalid |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 422 | Request validation failed |
| 500 | Internal server error |

## Authentication

Protected endpoints will use a Supabase access token in the Authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

FastAPI will verify the token and enforce the required permissions.
