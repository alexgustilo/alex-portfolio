from uuid import UUID

from app.core.supabase import get_admin_supabase


def get_all_messages(status_filter: str | None = None) -> list[dict]:
    query = (
        get_admin_supabase()
        .table("contact_messages")
        .select("*")
        .order("created_at", desc=True)
    )

    if status_filter:
        query = query.eq("status", status_filter)

    response = query.execute()
    return response.data or []


def get_message_by_id(message_id: UUID) -> dict | None:
    response = (
        get_admin_supabase()
        .table("contact_messages")
        .select("*")
        .eq("id", str(message_id))
        .limit(1)
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def update_message_status(message_id: UUID, new_status: str) -> dict | None:
    response = (
        get_admin_supabase()
        .table("contact_messages")
        .update({"status": new_status})
        .eq("id", str(message_id))
        .select("*")
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def delete_message(message_id: UUID) -> bool:
    response = (
        get_admin_supabase()
        .table("contact_messages")
        .delete()
        .eq("id", str(message_id))
        .select("id")
        .execute()
    )
    return bool(response.data)
