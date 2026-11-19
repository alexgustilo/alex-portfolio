# Frontend Development Guide

## Requirements

- Node.js
- npm

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Default local URL:

http://localhost:3000

## Lint

```bash
npm run lint
```

## Production Build

```bash
npm run build
```

## Environment Variables

Create `.env.local` when frontend environment configuration is needed.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Only public values should use the `NEXT_PUBLIC_` prefix.

Never place service-role keys or private credentials in frontend environment variables.

## Development Workflow

1. Review the existing component and styles.
2. Make focused changes.
3. Run ESLint.
4. Run the production build.
5. Test the affected pages.
6. Review Git changes before committing.

## Git Guidelines

- Use descriptive commit messages.
- Keep commits focused.
- Do not commit `.env.local`.
- Do not commit `node_modules/` or `.next/`.
- Review changes before pushing.
