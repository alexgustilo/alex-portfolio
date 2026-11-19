# Alex Portfolio - Project Documentation

## 1. Overview

A modern, full-stack personal portfolio showcasing Alex Gustilo's background, technical skills, projects, certificates, and development journey.

The system includes a public-facing portfolio website and a secure Admin Dashboard for managing portfolio content.

## 2. Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Python and FastAPI
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Image Storage:** Supabase Storage
- **Deployment:** Fly.io
- **Version Control:** Git and GitHub

## 3. Public Frontend Modules

- Home
- About
- Skills
- Projects
- Certificates
- Development Journey
- Contact

Visitors can view portfolio information, explore projects and certificates, and submit messages through the contact form.

## 4. Admin Dashboard

The Admin Dashboard is a private area accessible only to authorized administrators.

### Admin Modules

- **Admin Login:** Secure administrator authentication.
- **Dashboard:** Overview of portfolio content and contact messages.
- **Projects Management:** Create, view, update, and delete projects.
- **Skills Management:** Manage technical skills and categories.
- **Certificates Management:** Upload, update, and delete certificates.
- **Messages Management:** View and manage messages submitted through the contact form.
- **Profile Management:** Update personal information displayed on the public portfolio.

## 5. Application Routes

### Public Routes

- `/`
- `/projects`
- `/certificates`
- `/contact`

### Admin Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/projects`
- `/admin/skills`
- `/admin/certificates`
- `/admin/messages`
- `/admin/profile`

## 6. System Architecture

- **Next.js:** Handles the public portfolio website and Admin Dashboard user interfaces.
- **FastAPI:** Handles backend APIs, business logic, validation, and protected administrative operations.
- **Supabase PostgreSQL:** Stores portfolio content, administrator-related data, and contact messages.
- **Supabase Auth:** Handles administrator authentication.
- **Supabase Storage:** Stores uploaded project and certificate images.
- **Fly.io:** Hosts the frontend and backend applications.

## 7. Database Modules

Planned database tables:

- `profiles`
- `projects`
- `skills`
- `certificates`
- `contact_messages`

Database relationships, fields, indexes, and Row Level Security policies will be defined during database implementation.

## 8. Image Management

- Uploaded project and certificate images belong in Supabase Storage.
- PostgreSQL stores image paths and related metadata.
- The Admin Dashboard provides image upload and management functionality.
- The public directory is reserved for static application assets.

## 9. Contact Message Workflow

1. A visitor submits the public contact form.
2. Next.js sends the request to the FastAPI backend.
3. FastAPI validates and processes the submission.
4. The message is stored in Supabase PostgreSQL.
5. The administrator can view and manage the message through the Admin Dashboard.
6. Email notifications can be integrated to notify the portfolio owner of new messages.

## 10. Security

- Never expose Supabase service-role keys in frontend code.
- Use environment variables for secrets.
- Configure appropriate Supabase RLS policies.
- Require authentication and authorization for administrative operations.
- Validate backend requests.
- Protect admin routes using server-side authentication checks.
- Keep privileged database operations inside the backend.
- Use HTTPS in production.

## 11. Development Roadmap

1. Frontend foundation and design system
2. Public portfolio UI development
3. Admin Dashboard UI development
4. Supabase configuration and database schema
5. Supabase authentication and security
6. FastAPI backend development
7. Frontend and backend integration
8. Image upload and contact message functionality
9. Testing and security
10. Fly.io deployment

## 12. Deployment Architecture

The frontend and backend will be deployed as separate applications on Fly.io.

Supabase will provide the managed PostgreSQL database, authentication, and image storage services.

Environment variables will be configured separately for the frontend and backend.