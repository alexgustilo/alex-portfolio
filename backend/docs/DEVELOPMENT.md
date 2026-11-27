# Backend Development Guide

## Requirements

- Python 3
- pip
- A Supabase project configured for Authentication, PostgreSQL, and Storage
- Git
- Node.js is not required to run the backend independently

## Backend setup

From the repository root:

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

If the virtual environment already exists, activate it instead of creating another one.

## Environment configuration

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

Use the actual values from your Supabase project.

The Supabase URL and public/publishable key are required by the application settings. The service-role key is optional during startup but required for privileged database and Storage operations.

Never commit `.env` or share its secret values.

## Dependencies

Install the packages declared in `requirements.txt`.

The backend uses FastAPI and Pydantic for API handling and validation, together with the configured Supabase Python client.

`python-multipart` is required for multipart image upload endpoints.

Do not install packages individually unless a new dependency is actually needed. Update `requirements.txt` when adding a project dependency.

## Run the backend

From `backend/`, with the virtual environment activated:

```bash
uvicorn app.main:app --reload
```

The development server normally runs at:

`http://localhost:8000`

Available endpoints:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

To bind locally to a specific address and port:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## Backend organization

Feature-specific code belongs in `app/features/`.

Each feature should keep its responsibilities separated:

- `routes.py`: HTTP routes and request handling.
- `schemas.py`: Pydantic request and response models.
- `service.py`: business logic and data operations.

Shared code belongs in:

- `app/core/`: configuration, Supabase clients, and security utilities.
- `app/dependencies/`: reusable FastAPI dependencies.

The Messages implementation remains in:

- `app/routes/messages.py`
- `app/schemas/messages.py`
- `app/services/message_service.py`

Preserve its existing organization unless a dedicated Messages refactor is explicitly planned.

Register new feature routers in `app/main.py` under the configured API prefix.

## Supabase prerequisites

The backend expects the following database tables:

- `projects`
- `skills`
- `certificates`
- `contact_messages`
- `profiles`

The database schema must match the models and queries used by the application. Database migrations and SQL schema definitions are not included in this project snapshot.

### Storage buckets

Create and configure these buckets in Supabase Storage:

| Bucket | Purpose |
|---|---|
| `portfolio-projects` | Project images |
| `portfolio-certificates` | Certificate images |
| `portfolio-avatars` | Administrator profile avatars |

The upload feature creates UUID-based filenames under the corresponding `projects/`, `certificates/`, or `avatars/` folder.

Configure public-read access if the returned image URLs must be displayed without authentication. Upload and deletion operations still require administrator authorization through the backend.

## Frontend integration

Run the frontend separately.

Configure the frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

The backend CORS configuration must allow the frontend origin. The default development origin is `http://localhost:3000`.

## Verification workflow

Use focused checks while developing:

### 1. Python compilation

From `backend/` with the virtual environment activated:

```bash
python -m compileall -q app
```

### 2. Application import

```bash
python -c "from app.main import app; print('FastAPI import successful')"
```

### 3. API route registration

```bash
python -c "from app.main import app; print('\n'.join(sorted(app.openapi()['paths'].keys())))"
```

### 4. Runtime health check

Start the backend:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

In another terminal:

```bash
curl -i http://127.0.0.1:8000/health
```

### 5. Integration checks

When Supabase credentials and test data are available, verify:

- Public project, skill, and certificate reads.
- Administrator login and current-user retrieval.
- Administrator CRUD operations.
- Contact submission.
- Administrator profile retrieval and updates.
- Message listing and status updates.
- Project, certificate, and avatar image uploads and deletions.

Use test records and test images. Avoid modifying production data during development checks.

There is no automated test suite included in the current backend snapshot. Manual checks must not be described as automated test coverage.

## Development practices

- Preserve existing API paths, methods, schemas, and response contracts unless an API change is intentional.
- Keep route handlers focused on HTTP concerns.
- Keep feature-specific operations inside their feature services.
- Reuse shared authentication dependencies.
- Protect privileged operations with `get_current_admin`.
- Keep credentials and tokens out of source code and logs.
- Avoid unnecessary changes to unrelated features.
- Update the relevant backend documentation when implementation details change.
