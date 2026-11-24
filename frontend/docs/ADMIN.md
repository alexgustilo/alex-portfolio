
# Admin Interface

## Routes in the current code

| Route | Current implementation |
|---|---|
| `/admin/login` | Login form calling `POST /auth/login` |
| `/admin/dashboard` | Dashboard statistics and profile name loaded from the API |
| `/admin/projects` | Project list and create/edit/delete interface with image upload |
| `/admin/skills` | Skills listing and create, update, and delete interface |
| `/admin/certificates` | Certificate listing, CRUD, and image upload/delete interface |
| `/admin/messages` | Deferred; management page is not currently implemented |
| `/admin/profile` | Administrator profile display and full-name update; avatar upload pending |

The protected route group is `(protected)`. Its URL paths do not include the group name.

## Login and session flow

1. The administrator submits email and password on `/admin/login`.
2. `loginAdmin` in `src/lib/auth.ts` sends them to `POST /api/v1/auth/login`.
3. The backend authenticates with Supabase Auth and checks the trusted `app_metadata.role` value.
4. The frontend stores the returned access and refresh tokens in `sessionStorage`.
5. The protected layout calls `GET /api/v1/auth/me` with the access token and checks that `app_metadata.role` is `admin`.
6. Missing or rejected sessions are redirected to `/admin/login`.

The frontend also provides a refresh helper and logout helper. The current protected layout does not automatically refresh an expired access token; a rejected session is cleared and redirected.

## Dashboard data

The dashboard requests the following endpoints:

| Dashboard value | API request |
|---|---|
| Total Projects | `GET /projects/` |
| Certificates | `GET /certificates/` |
| Technical Skills | `GET /skills/` |
| New Messages | `GET /messages/?status=unread` |
| Administrator name | `GET /profile/me` |

The message and profile endpoints require administrator authorization. The dashboard uses `Promise.allSettled`, so failed requests display unavailable values and a warning instead of failing the entire page.

## Project management

The project page uses the projects API for listing and CRUD operations. It supports project details, technology tags, featured status, display order, and image selection.

Image flow:
1. The browser sends a selected image as `multipart/form-data` to `POST /api/v1/uploads/projects`.
2. The backend validates the extension, declared MIME type, image signature, and 5 MB size limit.
3. The backend stores the file in the `portfolio-projects` Supabase Storage bucket and returns `image_url` and `path`.
4. The project record stores the returned public image URL.
5. The page can request deletion through `DELETE /api/v1/uploads/{file_path}` when removing/replacing an image.

Upload/delete endpoints are administrator-only. Storage bucket configuration must allow public reads if the returned public URLs are to be displayed without authentication.

## Security boundaries and limitations

- The frontend guard improves navigation behavior but is not the security boundary.
- FastAPI must validate the Supabase access token and check the server-controlled `app_metadata.role` for every protected operation.
- Tokens currently live in `sessionStorage`, which is accessible to JavaScript running on the page. A production-hardening task should evaluate an HttpOnly, Secure, SameSite cookie/session architecture.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.
- The Messages sidebar destination does not mean that a Messages management interface is implemented. Skills and Certificates have their own management pages. Profile currently supports profile display and name updates, but not avatar uploads.

## Verification status

The project login/dashboard and project-image upload flow have been manually exercised in the development environment according to the development session. This repository snapshot does not include automated frontend integration tests. Re-test create, read, update, delete, and image replacement/deletion before treating all project operations as release-verified.
