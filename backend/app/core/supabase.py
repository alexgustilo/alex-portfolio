from functools import lru_cache

from fastapi import HTTPException, status
from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.core.config import settings


@lru_cache
def get_supabase() -> Client:
    """Client for public operations using the publishable key."""
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key.get_secret_value(),
    )


@lru_cache
def get_admin_supabase() -> Client:
    """
    Server-only privileged client.

    Only call this from operations that already require
    verified admin authorization.
    """
    secret = settings.supabase_service_role_key

    if secret is None or not secret.get_secret_value().strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SUPABASE_SERVICE_ROLE_KEY is not configured.",
        )

    return create_client(
        settings.supabase_url,
        secret.get_secret_value(),
        options=ClientOptions(
            auto_refresh_token=False,
            persist_session=False,
        ),
    )
