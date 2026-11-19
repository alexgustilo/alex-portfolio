# Admin Dashboard Documentation

## Overview

The Admin Dashboard is intended to provide a private interface for managing portfolio content.

## Routes

| Route | Purpose |
|---|---|
| `/admin/login` | Administrator login |
| `/admin/dashboard` | Overview and statistics |
| `/admin/projects` | Project management |
| `/admin/skills` | Skills management |
| `/admin/certificates` | Certificate management |
| `/admin/messages` | Contact message management |
| `/admin/profile` | Administrator profile |

## Planned Capabilities

- Admin authentication.
- Dashboard statistics.
- Project CRUD operations.
- Skills CRUD operations.
- Certificate CRUD operations.
- Message status management.
- Profile management.

## Security Requirements

The Admin interface must use backend-verified authentication and authorization.

A hidden navigation item or protected-looking frontend layout is not sufficient to secure administrative data.

Admin operations must be authorized by FastAPI before accessing protected resources.

## Current Status

The frontend Admin layout and initial dashboard foundation have been started. Full functionality and authentication integration remain under development.
