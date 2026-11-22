
# Alex Portfolio — Backend

FastAPI REST API for the Alex Portfolio application. It handles administrator authentication, portfolio content records, contact submissions, message management, profile data, and project-image storage.

## Technology

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | REST API |
| Uvicorn | ASGI development server |
| Pydantic / Pydantic Settings | Validation and configuration |
| Supabase Auth | Administrator authentication |
| Supabase PostgreSQL | Application data |
| Supabase Storage | Project image files |
| `python-multipart` | Multipart file upload parsing |

See `requirements.txt` for the installed dependency list.

## Features in the current code

### Public endpoints
- Health and API information.
- Read projects, skills, and certificates.
- Submit a contact message to `contact_messages`.

### Administrator endpoints
- Login, refresh, current-user lookup, and logout.
- Create, read, update, and delete projects, skills, and certificates.
- Read, update status, and delete contact messages.
- Read and update the administrator profile.
- Upload and delete project images in Supabase Storage.

Contact submissions are stored in the database. No SMTP/email notification service is implemented.

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
│   ├── routes/
│   │   ├── auth.py
│   │   ├── certificates.py
│   │   ├── contact.py
│   │   ├── messages.py
│   │   ├── profile.py
│   │   ├── projects.py
│   │   ├── skills.py
│   │   └── uploads.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── certificates.py
│   │   ├── contact.py
│   │   ├── messages.py
│   │   ├── profile.py
│   │   ├── projects.py
│   │   ├── skills.py
│   │   └── uploads.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── certificate_service.py
│   │   ├── contact_service.py
│   │   ├── message_service.py
│   │   ├── profile_service.py
│   │   ├── project_service.py
│   │   ├── skill_service.py
│   │   └── upload_service.py
│   └── main.py
├── docs/
├── requirements.txt
└── README.md
```

## Requirements

- Python 3
- pip
- A Supabase project with the required tables and Auth configuration
- A `portfolio-projects` Storage bucket for project-image upload

## Local setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` with the required settings:

```env
APP_NAME="Alex Portfolio API"
APP_VERSION=1.0.0
ENVIRONMENT=development
API_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_server_secret_key
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are required by the settings model. `SUPABASE_SERVICE_ROLE_KEY` is optional at startup but required for privileged operations (admin database access and Storage upload/delete). Keep `.env` private and never commit real credentials.

Start the server:

```bash
uvicorn app.main:app --reload
```

Local endpoints:
- API root: http://localhost:8000/
- Health: http://localhost:8000/health
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Documentation

- [API reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development](docs/DEVELOPMENT.md)
- [Security](docs/SECURITY.md)

## Implementation and verification status

| Area | Implementation | Verification note |
|---|---|---|
| FastAPI app and CORS | Implemented | Runtime behavior depends on environment |
| Supabase clients | Implemented | Requires valid project configuration |
| Admin authentication | Implemented | Manually exercised in development; repeat before release |
| Public project/skill/certificate reads | Implemented | Database contents/configuration determine results |
| Admin CRUD routes | Implemented | Exercise each operation against the target database |
| Contact message insert | Implemented | No email notification |
| Message and profile routes | Implemented | Require admin role and database schema |
| Project image upload/delete | Implemented | Requires Storage bucket and service key |
| Automated test suite | Not included in this snapshot | Not verified |
| Production deployment | Not verified | Not deployed by this snapshot |

The project-image upload and admin login/dashboard flows were manually exercised during development. This is not a substitute for a complete automated or release test suite.
