# Alex Portfolio - AI Coding Guidelines

## Technology
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- FastAPI backend (separate application)
- Supabase PostgreSQL and Storage

## Development Rules
1. Inspect existing files before modifying them.
2. Use TypeScript for frontend code.
3. Prefer reusable components.
4. Use Server Components by default.
5. Add "use client" only when client-side interactivity is required.
6. Use Tailwind CSS for styling.
7. Keep frontend and backend responsibilities separate.
8. Never expose secrets or service-role keys in browser code.
9. Do not invent project information or achievements.
10. Preserve existing features and assets.
11. Avoid unnecessary dependencies.
12. Test changes using npm run lint and npm run build.
13. Explain important file changes.
14. Do not modify unrelated files.

## Project Design
- Purple and blue visual accents.
- Clean, professional, responsive interface.
- Consistent spacing and typography.
- Accessible navigation and controls.

## Storage
- Use Supabase Storage for uploaded portfolio images.
- Store image paths and related metadata in PostgreSQL.
- Keep only necessary static assets in public/.
