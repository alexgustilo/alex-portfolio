# Frontend Architecture

## Overview

The application uses Next.js App Router with a modular component structure.

The application has two primary areas:

1. Public Portfolio
2. Admin Dashboard

## Public Routes

- `/` – Public portfolio homepage.

## Admin Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/projects`
- `/admin/skills`
- `/admin/certificates`
- `/admin/messages`
- `/admin/profile`

The protected route group is a routing and layout organization mechanism. It does not independently enforce authentication.

## Component Organization

- `components/layout`: Navigation and shared page layout.
- `components/sections`: Public portfolio sections.
- `components/admin`: Admin interface components.
- `components/shared`: Reusable presentation components.
- `components/ui`: Reusable interface primitives.

## Data Flow

The intended production data flow is:

Next.js UI → FastAPI REST API → Supabase

The frontend must not access the Supabase service-role key.
