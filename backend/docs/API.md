# Backend API Reference

Base URL during local development: `http://localhost:8000`

All application endpoints use the `/api/v1` prefix unless noted. Interactive documentation is available at `/docs` and `/redoc`.

## Access levels

- **Public**: no Bearer token required.
- **Authenticated**: valid Supabase access token required.
- **Admin**: valid token plus `app_metadata.role == "admin"` required.

Protected endpoints must be authorized by the backend. Frontend navigation restrictions are not authorization.

## Root and health

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | API metadata |
| GET | `/health` | Public | Health response |

## Authentication — `/api/v1/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Sign in administrator |
| POST | `/refresh` | Public | Exchange refresh token for a new session |
| GET | `/me` | Authenticated | Return current authenticated user |
| POST | `/logout` | Authenticated | Sign out current user/session |

Login body:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Refresh body:

```json
{
  "refresh_token": "supabase-refresh-token"
}
```

The login service checks the trusted Supabase `app_metadata.role` before returning the session. The current-user endpoint requires `Authorization: Bearer <access_token>`.

## Projects — `/api/v1/projects`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List projects ordered by `display_order` |
| GET | `/{project_id}` | Public | Get one project |
| POST | `/` | Admin | Create project |
| PATCH | `/{project_id}` | Admin | Update project |
| DELETE | `/{project_id}` | Admin | Delete project |

Create body:

```json
{
  "title": "Portfolio API Test Project",
  "description": "A sample project description.",
  "image_url": null,
  "live_url": null,
  "github_url": null,
  "technologies": ["Next.js", "FastAPI", "Supabase"],
  "featured": false,
  "display_order": 0
}
```

`title` is 1–150 characters and `description` must not be empty. `technologies` is a string array. The response includes the UUID and timestamps.

## Skills — `/api/v1/skills`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List skills ordered by `display_order` |
| GET | `/{skill_id}` | Public | Get one skill |
| POST | `/` | Admin | Create skill |
| PATCH | `/{skill_id}` | Admin | Update skill |
| DELETE | `/{skill_id}` | Admin | Delete skill |

Create body:

```json
{
  "name": "Python",
  "category": "Backend",
  "proficiency": 75,
  "icon": null,
  "display_order": 0
}
```

`name` and `category` are required. `proficiency` must be from 0 to 100.

## Certificates — `/api/v1/certificates`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List certificates ordered by `display_order` |
| GET | `/{certificate_id}` | Public | Get one certificate |
| POST | `/` | Admin | Create certificate |
| PATCH | `/{certificate_id}` | Admin | Update certificate |
| DELETE | `/{certificate_id}` | Admin | Delete certificate |

Create body:

```json
{
  "title": "Python Bootcamp",
  "issuer": "Example Organization",
  "issue_date": "2026-01-01",
  "credential_url": null,
  "image_url": null,
  "description": "Certificate description.",
  "display_order": 0
}
```

`issue_date` is an optional ISO date (`YYYY-MM-DD`).

## Contact — `/api/v1/contact`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Save a contact submission |

Body:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project inquiry",
  "message": "Hello, I would like to discuss a project."
}
```

The route inserts the submission into `contact_messages` and returns a success message with HTTP 201. It does not send an email. The current frontend Contact section does not yet call this endpoint.

## Messages — `/api/v1/messages`

All routes require Admin access.

| Method | Path | Description |
|---|---|---|
| GET | `/` | List messages |
| GET | `/{message_id}` | Retrieve one message |
| PATCH | `/{message_id}` | Update message status |
| DELETE | `/{message_id}` | Delete message |

Optional query parameter: `status=unread|read|replied|archived`.

Update body:

```json
{
  "status": "read"
}
```

## Profile — `/api/v1/profile`

Both routes require Admin access.

| Method | Path | Description |
|---|---|---|
| GET | `/me` | Get or create the current administrator profile |
| PATCH | `/me` | Update profile fields |

Update body:

```json
{
  "full_name": "Alex Gustilo",
  "avatar_url": null
}
```

Only fields supplied in the PATCH body are updated. `full_name` cannot be null.

## Uploads — `/api/v1/uploads`

All upload and delete endpoints require Admin access.

### Upload endpoints

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/projects` | Admin | Upload a project image |
| POST | `/certificates` | Admin | Upload a certificate image |
| POST | `/avatars` | Admin | Upload an administrator profile avatar |

Uploads use `multipart/form-data` with a single file field named `file`.

### Delete endpoints

| Method | Path | Access | Description |
|---|---|---|---|
| DELETE | `/projects/{filename}` | Admin | Delete a project image |
| DELETE | `/certificates/{filename}` | Admin | Delete a certificate image |
| DELETE | `/avatars/{filename}` | Admin | Delete an avatar image |

The project deletion route is registered as `DELETE /uploads/{file_path:path}` and expects a path beginning with `projects/`. Certificate and avatar deletion routes explicitly use their respective folder prefixes.

Examples:

```text
DELETE /api/v1/uploads/projects/example.webp
DELETE /api/v1/uploads/certificates/example.png
DELETE /api/v1/uploads/avatars/example.jpg
```

### Image validation

All three upload types use the same validation rules:

- Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Declared MIME type must match the file extension.
- Actual binary image signature is checked.
- Maximum accepted file size: 5 MiB (5 × 1024 × 1024 bytes).
- Empty files and invalid image content are rejected.
- Filenames are generated using UUID values rather than trusting the uploaded filename.

### Supabase Storage buckets

| Image type | Bucket | Storage folder |
|---|---|---|
| Project | `portfolio-projects` | `projects/` |
| Certificate | `portfolio-certificates` | `certificates/` |
| Avatar | `portfolio-avatars` | `avatars/` |

Successful upload response:

```json
{
  "image_url": "https://your-project.supabase.co/storage/v1/object/public/portfolio-projects/projects/example.webp",
  "path": "projects/example.webp"
}
```

The response includes:

- `image_url`: public URL used to display the image.
- `path`: Storage path used when deleting the image.

The upload service uses the privileged Supabase client. Configure public-read access on the respective buckets if images need to be displayed without authentication. Upload and deletion operations remain protected by backend Admin authorization.

Deletion routes restrict the supplied path to a single filename inside the appropriate folder. They do not allow deletion outside their designated folder.

## Common response codes

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful deletion; no response body |
| 400 | Invalid request or Storage path |
| 401 | Missing or invalid authentication |
| 403 | Admin role required |
| 404 | Resource not found |
| 413 | Image exceeds size limit |
| 415 | Unsupported or invalid image |
| 422 | Request validation error |
| 502 | Supabase Storage operation failed |
| 503 | Required privileged Supabase key unavailable |

Exact errors can also depend on Supabase responses and FastAPI validation.
