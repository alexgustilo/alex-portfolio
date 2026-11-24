# Component Guide

## Public layout

Located in `src/components/public/layout/`:

- `navbar.tsx`: public portfolio navigation and responsive mobile menu.
- `footer.tsx`: portfolio footer.

## Public sections

Located in `src/components/public/sections/`:

- `hero.tsx`
- `about.tsx`
- `skills.tsx`
- `projects.tsx`
- `certificates.tsx`
- `journey.tsx`
- `contact.tsx`

Most public section content is sourced from `src/lib/data.ts`.

The Contact section currently renders a mail link rather than a backend contact submission form.

## Admin layout

Located in `src/components/admin/layout/`:

- `admin-sidebar.tsx`: administrator navigation.
- `admin-header.tsx`: administrator header, profile information, and avatar display.

The Admin layout is shared by the protected management routes.

## Dashboard feature

Dashboard-specific components are located in `src/features/dashboard/components/`:

- `dashboard-header.tsx`: Dashboard heading and administrator greeting.
- `dashboard-stat-card.tsx`: reusable statistics card.
- `dashboard-overview.tsx`: Quick Overview and Getting Started sections.

Dashboard data and API handling are separated from the presentation components:

- `src/features/dashboard/services/dashboard-service.ts`
- `src/features/dashboard/types/dashboard.ts`

The route page composes these components rather than containing all Dashboard markup and API logic.

## Other Admin pages

Projects, Skills, Certificates, and Profile currently remain in their existing App Router page files.

Their feature-based refactoring is planned. Do not assume these pages have already been moved into `src/features/`.

The Messages management interface remains deferred. Do not modify its existing folders or behavior as part of unrelated feature refactoring.

## Shared components

Located in `src/components/shared/`:

- `section-heading.tsx`: reusable label, title, and description presentation.

## Guidelines

- Keep components focused on one responsibility.
- Keep feature-specific components, services, and types together under `src/features/<feature>/`.
- Keep globally shared components under `src/components/`.
- Keep shared API and authentication infrastructure in `src/lib/`.
- Use TypeScript for component props and API response shapes.
- Preserve existing API behavior, validation, and responsive design when refactoring.
- Avoid introducing dependencies for small presentation changes.
- Update this guide when the component structure materially changes.
