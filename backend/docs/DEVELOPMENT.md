# Development Guide

## Local Environment

The backend is developed using Python, FastAPI, Uvicorn, and Supabase.

Recommended local directory:

`~/My_Project_Files/alex-portfolio/backend`

## Activate the Virtual Environment

From the backend directory:

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

The backend requires:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Administrator database operations also require:

- `SUPABASE_SERVICE_ROLE_KEY`

Never commit `.env`.

## Start the Development Server

```bash
uvicorn app.main:app --reload
```

The local API is available at:

`http://localhost:8000`

## Interactive API Documentation

Swagger UI:

`http://localhost:8000/docs`

ReDoc:

`http://localhost:8000/redoc`

## Validate Python Syntax

```bash
python -m compileall -q app
```

No output generally indicates that Python syntax compilation completed successfully.

## Verify Application Imports and Registered Routes

```bash
python - <<'PY'
from app.main import app

print("Application:", app.title)

for path, methods in app.openapi()["paths"].items():
    print(path, "->", ", ".join(methods.keys()))
PY
```

This verifies application imports and OpenAPI route registration. It does not perform database integration tests.

## Health Check

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "environment": "development"
}
```

## Testing Database Operations

Use Swagger UI to test the API.

Suggested testing sequence:

1. Authenticate using the admin login endpoint.
2. Authorize Swagger with the returned access token.
3. Create a temporary project.
4. Retrieve the project list.
5. Update the temporary project.
6. Delete the temporary project.
7. Repeat for skills and certificates.
8. Submit a public contact message.
9. Verify that an administrator can retrieve and manage the message.

Use test records, and avoid deleting actual portfolio data.

## Automated Tests

The project has a `tests/` directory. Automated unit and integration test coverage still needs to be implemented and verified.

## Update Dependencies

After intentionally adding or changing Python packages:

```bash
pip freeze > requirements.txt
```

Review the resulting dependency changes before committing.

## Git Guidelines

Check current changes:

```bash
git status
```

Review changes:

```bash
git diff
```

The project uses descriptive commits and individual file commits when appropriate.

## Development Workflow

1. Review the existing implementation.
2. Make a focused change.
3. Validate Python syntax.
4. Verify imports and route registration.
5. Test the affected endpoint.
6. Review Git changes.
7. Update documentation.
8. Commit and push the completed work.

## Important

A successful application startup or import check does not prove that all Supabase database operations and authentication workflows are working.
