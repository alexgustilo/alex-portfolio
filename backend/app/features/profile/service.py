from app.core.supabase import get_admin_supabase


def get_or_create_profile(user) -> dict:
    user_id = str(user.id)
    client = get_admin_supabase()

    response = (
        client.table("profiles")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    records = response.data or []
    if records:
        return records[0]

    metadata = getattr(user, "user_metadata", None) or {}
    email = getattr(user, "email", None) or ""
    full_name = (
        metadata.get("full_name")
        or metadata.get("name")
        or email.split("@")[0]
        or "Portfolio Admin"
    )

    inserted = (
        client.table("profiles")
        .insert({
            "id": user_id,
            "full_name": full_name,
        })
        .select("*")
        .execute()
    )

    return inserted.data[0]


def update_profile(user, data: dict) -> dict:
    get_or_create_profile(user)

    response = (
        get_admin_supabase()
        .table("profiles")
        .update(data)
        .eq("id", str(user.id))
        .select("*")
        .execute()
    )

    records = response.data or []
    if not records:
        raise LookupError("Profile not found.")

    return records[0]
