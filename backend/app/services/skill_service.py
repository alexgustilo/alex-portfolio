from uuid import UUID

from app.core.supabase import get_admin_supabase, get_supabase


def get_all_skills() -> list[dict]:
    response = (
        get_supabase()
        .table("skills")
        .select("*")
        .order("display_order")
        .execute()
    )
    return response.data or []


def get_skill_by_id(skill_id: UUID) -> dict | None:
    response = (
        get_supabase()
        .table("skills")
        .select("*")
        .eq("id", str(skill_id))
        .limit(1)
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def create_skill(data: dict) -> dict:
    response = (
        get_admin_supabase()
        .table("skills")
        .insert(data)
        .select("*")
        .execute()
    )
    return response.data[0]


def update_skill(skill_id: UUID, data: dict) -> dict | None:
    response = (
        get_admin_supabase()
        .table("skills")
        .update(data)
        .eq("id", str(skill_id))
        .select("*")
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def delete_skill(skill_id: UUID) -> bool:
    response = (
        get_admin_supabase()
        .table("skills")
        .delete()
        .eq("id", str(skill_id))
        .select("id")
        .execute()
    )
    return bool(response.data)
