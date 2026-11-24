
# Component Guide

## Public layout

Located in `src/components/layout/`:

- `navbar.tsx`: sticky section navigation with a responsive mobile menu.
- `footer.tsx`: portfolio footer.

## Public sections

Located in `src/components/sections/`:

- `hero.tsx`
- `about.tsx`
- `skills.tsx`
- `projects.tsx`
- `certificates.tsx`
- `journey.tsx`
- `contact.tsx`

Most section content is sourced from `src/lib/data.ts`. The Contact section currently renders a mail link rather than a backend submission form.

## Admin layout

Located in `src/components/admin/layout/`:

- `admin-sidebar.tsx`: admin navigation.
- `admin-header.tsx`: admin page header.

The admin route pages include login, dashboard, projects, skills, certificates, and profile. The Messages sidebar destination remains deferred and does not currently have a management page.

## Shared components

Located in `src/components/shared/`:

- `section-heading.tsx`: reusable label, title, and description presentation.

## Guidelines

- Keep components focused on one responsibility.
- Use TypeScript for props and API response shapes.
- Keep API communication in `src/lib` rather than duplicating fetch logic in components.
- Preserve the existing design tokens and responsive behavior.
- Do not introduce a new dependency or styling system for a small presentation change.
- Update this guide when the component tree materially changes.
