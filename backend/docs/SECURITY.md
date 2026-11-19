# Security Guidelines

## Authentication

Supabase Auth is the planned identity provider for the Admin Dashboard.

The backend must verify Supabase access tokens before allowing access to protected endpoints.

## Authorization

Administrative access must be checked on the backend.

The Admin role should be stored in trusted Supabase `app_metadata`, not in user-editable profile metadata.

The frontend must never be treated as the security boundary.

## Environment Variables

Private credentials must be stored in the backend `.env` file during local development.

Never commit:

- Supabase service-role keys.
- Secret API keys.
- Database passwords.
- Private email credentials.
- Production environment variables.

The `.env.example` file should contain placeholders only.

## Supabase Keys

Use the publishable key (or legacy anon key) for operations governed by Supabase Row Level Security.

The service-role key bypasses Row Level Security and must only be used for carefully controlled server-side operations.

Never expose the service-role key to the browser or public frontend.

## Database Security

Enable Row Level Security on application tables.

Policies should follow the principle of least privilege:

- Public visitors may read intended public portfolio content.
- Public visitors may submit contact messages.
- Administrative operations require verified Admin authorization.
- Private messages and profile information must not be publicly accessible.

## API Protection

Before production deployment, implement and verify:

- Request validation.
- Authentication and authorization.
- Rate limiting for public endpoints.
- Safe error responses.
- Input abuse and spam protection.
- Secure CORS configuration.
- HTTPS in production.

## File Uploads

File uploads should validate:

- Allowed file types.
- File size limits.
- User permissions.
- Storage destination.

Public image access does not mean public upload permission.

## Production

Production secrets must be configured through Fly.io secrets or another secure environment-variable mechanism.

Never include secrets in source code, logs, or documentation.
