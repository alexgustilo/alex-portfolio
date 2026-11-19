# Backend Architecture

## Overview

The Alex Portfolio backend follows a modular architecture using FastAPI.

It acts as the API layer between the Next.js frontend and Supabase services.

## System Architecture

```text
                    Next.js Frontend
                           |
                           | HTTP / HTTPS
                           v
                     FastAPI Backend
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
           Routes       Services     Dependencies
             |             |             |
             +-------------+-------------+
                           |
                           v
                        Supabase
             +-------------+-------------+
             |             |             |
             v             v             v
         PostgreSQL    Supabase Auth   Storage
```

## Application Layers

### Core

Contains application-wide configuration and integrations.

- `config.py`: Environment variables and application settings.
- `supabase.py`: Supabase client initialization.
- `security.py`: Authentication and authorization helpers.

### Dependencies

Contains reusable FastAPI dependencies.

- `auth.py`: Verifies access tokens and checks administrative permissions.

### Routes

Contains HTTP endpoints and request handling.

Routes should remain focused on HTTP concerns and delegate complex operations to services.

### Schemas

Contains Pydantic models for validating incoming data and defining response structures.

### Services

Contains reusable application logic and integrations with external services.

Examples include authentication, database operations, and email delivery.

## Data Flow

1. A frontend application sends an HTTP request.
2. FastAPI receives the request through a route.
3. Dependencies validate authentication when required.
4. The route validates input through Pydantic schemas.
5. Service modules perform the required operation.
6. Supabase handles database, authentication, or storage operations.
7. FastAPI returns the response to the frontend.

## API Versioning

API endpoints are intended to use the `/api/v1` prefix.

This makes future API changes easier to manage without immediately breaking existing frontend integrations.
