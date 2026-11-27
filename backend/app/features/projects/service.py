from uuid import UUID

from app.core.supabase import get_admin_supabase, get_supabase


def get_all_projects() -> list[dict]:
    response = (
        get_supabase()
        .table("projects")
        .select("*")
        .order("display_order")
        .execute()
    )
    return response.data or []


def get_project_by_id(project_id: UUID) -> dict | None:
    response = (
        get_supabase()
        .table("projects")
        .select("*")
        .eq("id", str(project_id))
        .limit(1)
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def create_project(data: dict) -> dict:
    response = (
        get_admin_supabase()
        .table("projects")
        .insert(data)
        .select("*")
        .execute()
    )
    return response.data[0]


def update_project(project_id: UUID, data: dict) -> dict | None:
    response = (
        get_admin_supabase()
        .table("projects")
        .update(data)
        .eq("id", str(project_id))
        .select("*")
        .execute()
    )
    records = response.data or []
    return records[0] if records else None


def delete_project(project_id: UUID) -> bool:
    response = (
        get_admin_supabase()
        .table("projects")
        .delete()
        .eq("id", str(project_id))
        .select("id")
        .execute()
    )
    return bool(response.data)
