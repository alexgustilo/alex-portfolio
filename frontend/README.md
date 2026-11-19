# Alex Portfolio – Frontend

The frontend application for Alex Gustilo's developer portfolio.

Built with Next.js, React, TypeScript, and Tailwind CSS, this application provides a responsive public portfolio and an administrative interface for managing portfolio content.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| ESLint | Code quality |
| Supabase | Planned authentication and data integration |
| FastAPI | Planned backend API |

## Features

### Public Portfolio
- Hero section
- About section
- Technical skills
- Projects showcase
- Certificates and achievements
- Development journey
- Contact section
- Responsive navigation and footer

### Admin Dashboard
- Admin login interface
- Dashboard overview
- Project management interface
- Skills management interface
- Certificate management interface
- Messages interface
- Admin profile interface

Note: The Admin interface is currently under development. Its frontend layout does not yet provide complete authentication or database-backed management.

## Project Structure

```text
frontend/
├── public/
│   └── images/
│       ├── profile/
│       ├── projects/
│       ├── certificates/
│       └── tech/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── shared/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── docs/
├── PROJECT_DOCUMENTATION.md
├── package.json
└── README.md
```

## Getting Started

### Requirements
- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open:

http://localhost:3000

### Build for production

```bash
npm run build
```

### Run ESLint

```bash
npm run lint
```

## Development Guidelines

- Use TypeScript for application code.
- Keep components modular and reusable.
- Separate page sections into individual components.
- Keep shared data and utilities inside appropriate `lib/` modules.
- Use responsive layouts.
- Preserve the existing design system and visual consistency.
- Avoid exposing private API keys or credentials in frontend code.
- Use environment variables for public frontend configuration.

## Environment Variables

Create `.env.local` for frontend environment configuration when needed.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Only use `NEXT_PUBLIC_` for values that are safe to expose to the browser. Never put a Supabase service-role key in frontend environment variables.

## Documentation

See the `docs/` directory and [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for additional technical documentation.

## Project Status

The public portfolio frontend and initial Admin interface structure are under development.

Backend integration, authentication, database operations, and production deployment are planned development phases.

## Deployment

The planned production deployment platform is Fly.io.

Production environment variables and deployment configuration will be managed separately from source code.
