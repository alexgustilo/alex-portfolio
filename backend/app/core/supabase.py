from functools import lru_cache

from fastapi import HTTPException, status
from supabase import Client, create_client

from app.core.config import settings


@lru_cache
def get_supabase() -> Client:
    """Create the regular Supabase client."""
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key.get_secret_value(),
    )

@lru_cache
def get_admin_supabase() -> Client:
    """Create the privileged server-side Supabase client."""
    secret = settings.supabase_service_role_key

    if secret is None or not secret.get_secret_value().strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SUPABASE_SERVICE_ROLE_KEY is not configured.",
        )

    return create_client(
        settings.supabase_url,
        secret.get_secret_value(),
    )
