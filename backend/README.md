# Alex Portfolio Backend

The backend application for Alex Portfolio, a full-stack personal developer portfolio.

Built with FastAPI and Supabase, this application provides API endpoints for portfolio content, administrator authentication, contact submissions, and profile management.

**Development status:** Core API implementation is in place. Database integration, authentication flows, and production behavior still require end-to-end verification.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API framework |
| Uvicorn | ASGI application server |
| Pydantic | Request and response validation |
| Pydantic Settings | Environment configuration |
| Supabase PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | Planned file storage integration |

## Features

### Public API
- Retrieve portfolio projects, skills, and certificates.
- Submit contact form messages.
- API health checks.

### Administrator API
- Admin login and token refresh.
- Current authenticated user.
- Project management (Create, Read, Update, Delete).
- Skill management (Create, Read, Update, Delete).
- Certificate management (Create, Read, Update, Delete).
- Contact message management.
- Administrator profile management.

### Email Notifications
Optional SMTP notification when a visitor submits a contact message.

## Project Structure

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
│   │   └── skills.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── certificates.py
│   │   ├── contact.py
│   │   ├── messages.py
│   │   ├── profile.py
│   │   ├── projects.py
│   │   └── skills.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── certificate_service.py
│   │   ├── contact_service.py
│   │   ├── email_service.py
│   │   ├── message_service.py
│   │   ├── profile_service.py
│   │   ├── project_service.py
│   │   └── skill_service.py
│   └── main.py
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   └── SECURITY.md
├── tests/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Getting Started

### Requirements
- Python 3
- pip
- Supabase project
- Git

### 1. Navigate to the Backend

```bash
cd backend
```

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env
```

Configure the required Supabase values:

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

The privileged Supabase key is required for the current administrator database operations.

SMTP variables are optional. See `.env.example` and `docs/DEVELOPMENT.md`.

Never commit the actual `.env` file.

### 5. Start the Development Server

```bash
uvicorn app.main:app --reload
```

The API will be available at:

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## API Documentation

See [docs/API.md](docs/API.md) for the endpoint reference.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for application layers and request flow.

## Development Guide

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for local setup and testing instructions.

## Security

See [docs/SECURITY.md](docs/SECURITY.md) for authentication, authorization, Supabase credentials, and database security.

## Implementation Status

| Feature | Code status | Verification status |
|---|---|---|
| FastAPI application | Implemented | Import check passed |
| CORS configuration | Implemented | Runtime verification pending |
| Supabase clients | Implemented | Database verification pending |
| Authentication endpoints | Implemented | End-to-end verification pending |
| Projects API | Implemented | CRUD verification pending |
| Skills API | Implemented | CRUD verification pending |
| Certificates API | Implemented | CRUD verification pending |
| Contact submission | Implemented | Database verification pending |
| Messages API | Implemented | End-to-end verification pending |
| Profile API | Implemented | Database verification pending |
| SMTP notifications | Implemented | SMTP verification pending |
| Automated integration tests | Pending | Not verified |
| Production deployment | Pending | Not deployed |

## Development Principles

- Keep routes, schemas, services, and core configuration separated.
- Validate incoming requests using Pydantic.
- Verify admin authorization on protected operations.
- Keep secrets in backend environment variables.
- Test database operations before production deployment.
- Maintain documentation as the implementation evolves.

## Author

**Alex Gustilo**

BSIT Student | Aspiring Full-Stack Developer

GitHub: https://github.com/alexgustilo
