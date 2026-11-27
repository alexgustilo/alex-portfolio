from app.core.supabase import get_supabase


def create_contact_message(data: dict) -> None:
    get_supabase().table("contact_messages").insert(data).execute()
