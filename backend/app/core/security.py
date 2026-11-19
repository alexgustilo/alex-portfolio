from typing import Any


def is_admin_user(user: Any) -> bool:
    """
    Check the trusted Supabase app_metadata for admin authorization.

    app_metadata is server-controlled and should never be set
    directly by an ordinary user.
    """
    app_metadata = getattr(user, "app_metadata", None) or {}

    return app_metadata.get("role") == "admin"
