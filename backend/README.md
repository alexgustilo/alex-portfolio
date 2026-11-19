# Alex Portfolio Backend

The backend service for the Alex Portfolio application.

Built with FastAPI and Supabase, this project provides the foundation for portfolio data management, authentication, and communication between the Next.js frontend and the database.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API framework |
| Uvicorn | ASGI development server |
| Supabase | PostgreSQL database and authentication |
| Pydantic | Data validation and settings |
| PyJWT | JWT utilities |

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
│   ├── schemas/
│   ├── services/
│   └── main.py
├── docs/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Getting Started

### 1. Requirements

- Python 3.10 or newer
- pip
- A Supabase project

### 2. Create a virtual environment

```bash
python3 -m venv venv
```

Activate it:

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```powershell
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the following values in `.env`:

```env
APP_NAME=Alex Portfolio API
APP_VERSION=1.0.0
ENVIRONMENT=development
API_PREFIX=/api/v1

CORS_ORIGINS=http://localhost:3000

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_server_side_secret_key
```

Use the Supabase project URL and publishable key (or legacy anon key) from your project settings.

Keep secret keys private. Never commit `.env` to GitHub or expose a service-role key in frontend code.

### 5. Run the development server

From the backend directory:

```bash
uvicorn app.main:app --reload
```

The default development address is:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

Alternative API documentation:

http://127.0.0.1:8000/redoc

## Authentication

Authentication is designed around Supabase Auth.

The current authentication foundation includes:

- Supabase user token verification.
- Current-user dependency.
- Admin-role verification through trusted Supabase `app_metadata`.

The login endpoint, logout flow, and complete Admin authorization workflow are still under development.

## Database

The backend is designed to work with these Supabase tables:

- `profiles`
- `projects`
- `skills`
- `certificates`
- `contact_messages`

## Development Guidelines

- Keep API routes organized by responsibility.
- Use Pydantic schemas for request validation.
- Keep database operations in service modules as the application grows.
- Protect all administrative operations with server-side authorization.
- Never expose private environment variables.
- Test changes before committing them.

## Documentation

Additional technical documentation is available in the `docs/` directory:

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Security](docs/SECURITY.md)

## Project Status

This backend is currently under development.

The project structure, configuration, Supabase client foundation, and authentication dependencies are being prepared. API functionality, complete authentication, administrative operations, testing, and deployment will be implemented incrementally.

## Deployment

The planned deployment platform is Fly.io.

Production environment variables will be configured through the deployment platform rather than committed to the repository.
