# Security Guidelines

## 1. Authentication

The application uses Supabase Auth.

The backend provides endpoints for:

- Administrator login.
- Session refresh.
- Current authenticated user.
- Session logout.

Protected requests must include:

`Authorization: Bearer <access_token>`

The backend verifies the access token using Supabase Auth.

## 2. Authorization

Authentication and authorization are different:

- Authentication verifies the user's identity.
- Authorization checks what the authenticated user is allowed to do.

Administrator operations use the `get_current_admin` dependency.

The authorization helper checks the trusted Supabase `app_metadata.role` value.

Expected role:

`admin`

Do not trust a role value supplied by an ordinary frontend request or editable user metadata.

Administrator role assignment must be performed through a trusted administrative process.

## 3. Environment Variables

Sensitive settings must be stored in the backend `.env` file.

Never:

- Commit `.env` to Git.
- Place secret keys in frontend environment variables.
- Include secret keys in API responses.
- Share privileged credentials in screenshots or public documentation.

The `.env.example` file should contain placeholders only.

## 4. Supabase Keys

The backend uses two kinds of Supabase credentials.

### Publishable / Anonymous Key

Used by the regular Supabase client for public reads and contact submissions.

### Secret / Service Role Key

Used by the privileged server-side client for administrator database operations.

The privileged key can bypass Row Level Security.

Therefore:

- Keep it on the backend only.
- Never expose it to the browser.
- Never send it to the frontend.
- Restrict its use to operations that verify admin authorization first.
- Rotate it immediately if it is exposed.

## 5. Row Level Security

RLS is enabled on the initial portfolio database tables.

Initial policies include:

- Public reads for projects.
- Public reads for skills.
- Public reads for certificates.
- Public insertion of contact messages.
- Authenticated users selecting their own profile.

These starter policies are not a complete production security configuration.

### Important privileged-client behavior

The current administrator services use the privileged Supabase client.

Because this key bypasses RLS, database permissions do not replace backend authorization.

Every operation using the privileged client must be protected by correct server-side authorization.

RLS policies and the complete authorization model must be reviewed before production deployment.

## 6. Contact Form

The public contact endpoint accepts visitor messages.

Recommended safeguards before production:

- Add rate limiting.
- Add abuse and spam protection.
- Validate and limit submitted content.
- Monitor submission failures.
- Consider CAPTCHA or other anti-abuse controls.

## 7. Profile Management

Profile endpoints require administrator authorization.

Users should only be allowed to update their own profile.

The backend uses the authenticated user's ID when identifying their profile record.

## 8. API Error Handling

Protected endpoints should return appropriate HTTP status codes:

- `401` for missing or invalid authentication.
- `403` for insufficient permissions.
- `404` for missing resources.
- `422` for invalid request data.

Avoid returning credentials, tokens, or sensitive internal exception details in error responses.

## 9. Production Security Checklist

Before deployment:

- [ ] Verify admin login and token refresh.
- [ ] Test unauthorized access to every admin endpoint.
- [ ] Verify admin role assignment and enforcement.
- [ ] Review all database RLS policies.
- [ ] Protect privileged Supabase credentials.
- [ ] Add request rate limiting.
- [ ] Configure production CORS origins.
- [ ] Configure HTTPS.
- [ ] Configure secure environment variables.
- [ ] Test contact form abuse protection.
- [ ] Review application logs and error responses.
- [ ] Complete API and database security testing.

## Security Status

The backend contains initial authentication and authorization code, but the complete security model has not yet passed production verification.

Do not treat the current implementation as production-secure until the checklist above has been reviewed and tested.
