# Alex Portfolio - Project Documentation

## Overview
A modern personal portfolio showcasing Alex Gustilo's background,
technical skills, projects, certificates, and development journey.

## Technology Stack
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Python and FastAPI
- Database: Supabase PostgreSQL
- Image Storage: Supabase Storage
- Deployment: Fly.io
- Version Control: Git and GitHub

## Frontend Modules
- Home
- About
- Skills
- Projects
- Certificates
- Development Journey
- Contact

## Architecture
Next.js handles the website and user interface.
FastAPI handles backend APIs and business logic.
Supabase provides database and file storage services.
Fly.io hosts the frontend and backend applications.

## Image Management
Uploaded project and certificate images belong in Supabase Storage.
PostgreSQL stores their paths and metadata.
The public directory is reserved for static application assets.

## Development Roadmap
1. Frontend foundation and design system
2. Portfolio UI development
3. Supabase configuration
4. FastAPI development
5. Frontend and backend integration
6. Testing and security
7. Fly.io deployment

## Security
- Never expose service-role keys in frontend code.
- Use environment variables for secrets.
- Configure appropriate Supabase RLS policies.
- Validate backend requests.
- Use HTTPS in production.
