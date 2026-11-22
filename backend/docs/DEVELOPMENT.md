
# Backend Development Guide

## Requirements

- Python 3
- pip
- Supabase project with Auth, database tables, and Storage bucket
- Node.js is not required to run the backend alone

## Setup

From the repository root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
APP_NAME="Alex Portfolio API"
APP_VERSION=1.0.0
ENVIRONMENT=development
API_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_server_secret_key
```

The first two Supabase values are required by the settings model. The service-role key is optional during startup but required for privileged database and Storage operations. Do not commit `.env`.

## Dependencies

Install the exact packages listed in `requirements.txt`. `python-multipart` is required for the `UploadFile` multipart endpoint.

## Run

From `backend/` with the virtual environment activated:

```bash
uvicorn app.main:app --reload
```

Local docs:
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

## Database and Storage prerequisites

The code expects Supabase tables named `projects`, `skills`, `certificates`, `contact_messages`, and `profiles`. Their schema must match the Pydantic models and service queries. SQL migrations/schema files are not included in this project snapshot.

Project image upload expects a Storage bucket named `portfolio-projects`. The API generates public URLs; configure bucket read access appropriately. Upload/delete requests themselves require an administrator token.

## Verification workflow

1. Confirm `.env` is configured without exposing secrets.
2. Start the API and check `/health` and `/docs`.
3. Test public reads for projects, skills, and certificates.
4. Test admin login and `/auth/me` with a valid admin account.
5. Test admin CRUD endpoints against a non-production/test record.
6. Test contact insertion and message listing/status updates.
7. Test project image upload, URL display, and deletion.
8. Inspect logs and API responses for failures.

There is no automated test directory included in this snapshot. Do not describe manual checks as automated test coverage.

## Frontend integration

Run the frontend separately and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Backend CORS must allow the frontend origin. The default configured origin is `http://localhost:3000`.

## Development practices

- Keep request/response validation in `schemas/`.
- Keep database and Storage calls in `services/`.
- Keep route handlers focused on HTTP concerns.
- Protect every privileged operation with `get_current_admin`.
- Never log or commit credentials, access tokens, or refresh tokens.
- Run focused checks during implementation and broader verification before release.
