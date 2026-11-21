import httpx

from supabase import create_client

from app.core.config import settings
from app.core.security import is_admin_user


def _new_auth_client():
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key.get_secret_value(),
    )


def _session_payload(session, user) -> dict:
    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "token_type": session.token_type,
        "expires_in": session.expires_in,
        "expires_at": getattr(session, "expires_at", None),
        "user": {
            "id": str(user.id),
            "email": getattr(user, "email", None),
            "app_metadata": getattr(user, "app_metadata", None) or {},
        },
    }


def login_admin(email: str, password: str) -> dict:
    client = _new_auth_client()

    response = client.auth.sign_in_with_password({
        "email": email,
        "password": password,
    })

    if response.user is None or response.session is None:
        raise ValueError("No authenticated session returned.")

    if not is_admin_user(response.user):
        raise PermissionError("This account does not have admin access.")

    return _session_payload(response.session, response.user)


def refresh_admin_session(refresh_token: str) -> dict:
    client = _new_auth_client()

    response = client.auth.refresh_session(refresh_token)

    if response.user is None or response.session is None:
        raise ValueError("Unable to refresh the session.")

    if not is_admin_user(response.user):
        raise PermissionError("This account does not have admin access.")

    return _session_payload(response.session, response.user)


def logout_user(access_token: str) -> None:
    response = httpx.post(
        f"{settings.supabase_url.rstrip('/')}/auth/v1/logout",
        params={"scope": "local"},
        headers={
            "apikey": settings.supabase_anon_key.get_secret_value(),
            "Authorization": f"Bearer {access_token}",
        },
        timeout=15.0,
    )
    response.raise_for_status()
