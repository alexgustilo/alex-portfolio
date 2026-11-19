# Alex Portfolio

A personal full-stack developer portfolio built to showcase my background, technical skills, projects, certificates, and development journey.

The project includes a public portfolio website and an administrative interface for managing portfolio content.

## Project Overview

The portfolio uses a clean, minimalist, and professional design with purple and blue accents. It is responsive and designed for desktop, tablet, and mobile devices.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### Database and Services
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage

### Deployment
- Fly.io (planned)

## Main Features

### Public Portfolio
- Hero section
- About section
- Technical skills
- Projects showcase
- Certificates
- Development journey
- Contact section

### Admin Interface
- Admin dashboard
- Project management
- Skills management
- Certificate management
- Contact message management
- Profile management

**Note:** Admin authentication, backend integration, and complete database operations are still under development. The current Admin interface is not yet production-secure.

## Project Structure

```text
alex-portfolio/
├── README.md
├── frontend/
│   ├── src/
│   ├── docs/
│   ├── public/
│   └── README.md
└── backend/
    ├── app/
    ├── tests/
    ├── docs/
    └── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3
- Git
- Supabase project

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd alex-portfolio
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

See the [Frontend README](frontend/README.md) for more details.

### 3. Backend Setup

Open another terminal:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Configure your environment variables using `.env.example` as a reference.

Start the API:

```bash
uvicorn app.main:app --reload
```

See the [Backend README](backend/README.md) for more details.

## Documentation

### Frontend
- [Frontend README](frontend/README.md)
- [Architecture](frontend/docs/ARCHITECTURE.md)
- [Components](frontend/docs/COMPONENTS.md)
- [Admin Guide](frontend/docs/ADMIN.md)
- [Styling Guide](frontend/docs/STYLING.md)
- [Development Guide](frontend/docs/DEVELOPMENT.md)

### Backend
- [Backend README](backend/README.md)
- [Architecture](backend/docs/ARCHITECTURE.md)
- [API Documentation](backend/docs/API.md)
- [Development Guide](backend/docs/DEVELOPMENT.md)
- [Security Documentation](backend/docs/SECURITY.md)

## Environment Variables

Environment variables are configured separately:

- Frontend: `frontend/.env.local`
- Backend: `backend/.env`

Use the respective `.env.example` files as references.

Never commit actual credentials, passwords, or secret keys to the repository.

## Development Status

- [x] Frontend project setup
- [x] Public portfolio component structure
- [x] Initial Admin interface
- [x] Supabase project and database table setup
- [x] Backend project structure
- [x] Initial backend configuration
- [ ] Complete Supabase authentication
- [ ] Admin authorization
- [ ] Backend API implementation
- [ ] Frontend and backend integration
- [ ] Contact form email integration
- [ ] Production security review
- [ ] Deployment

## Author

**Alex Gustilo**

BSIT Student | Aspiring Full-Stack Developer

GitHub: [alexgustilo](https://github.com/alexgustilo)

---

This project is continuously being improved as part of my full-stack development learning journey.
