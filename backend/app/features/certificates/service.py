from uuid import UUID

from app.core.supabase import get_admin_supabase, get_supabase


def get_all_certificates() -> list[dict]:
    response = (
        get_supabase()
        .table("certificates")
        .select("*")
        .order("display_order")
        .execute()
    )
    return response.data or []


def get_certificate_by_id(certificate_id: UUID) -> dict | None:
    response = (
        get_supabase()
        .table("certificates")
        .select("*")
        .eq("id", str(certificate_id))
        .limit(1)
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def create_certificate(data: dict) -> dict:
    response = (
        get_admin_supabase()
        .table("certificates")
        .insert(data)
        .select("*")
        .execute()
    )
    return response.data[0]


def update_certificate(certificate_id: UUID, data: dict) -> dict | None:
    response = (
        get_admin_supabase()
        .table("certificates")
        .update(data)
        .eq("id", str(certificate_id))
        .select("*")
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def delete_certificate(certificate_id: UUID) -> bool:
    response = (
        get_admin_supabase()
        .table("certificates")
        .delete()
        .eq("id", str(certificate_id))
        .select("id")
        .execute()
    )
    return bool(response.data)
