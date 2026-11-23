
from app.core.supabase import get_admin_supabase


# Existing project image bucket.
PROJECT_BUCKET = "portfolio-projects"

# Separate bucket for certificate images.
CERTIFICATE_BUCKET = "portfolio-certificates"


def upload_project_image(
    file_content: bytes,
    file_path: str,
    content_type: str,
) -> str:
    """Upload a project image and return its public URL."""

    storage = get_admin_supabase().storage.from_(PROJECT_BUCKET)

    storage.upload(
        path=file_path,
        file=file_content,
        file_options={
            "content-type": content_type,
            "cache-control": "3600",
            "upsert": "false",
        },
    )

    return storage.get_public_url(file_path)


def delete_project_image(file_path: str) -> None:
    """Delete an uploaded project image."""

    storage = get_admin_supabase().storage.from_(PROJECT_BUCKET)
    storage.remove([file_path])


def upload_certificate_image(
    file_content: bytes,
    file_path: str,
    content_type: str,
) -> str:
    """Upload a certificate image and return its public URL."""

    storage = get_admin_supabase().storage.from_(CERTIFICATE_BUCKET)

    storage.upload(
        path=file_path,
        file=file_content,
        file_options={
            "content-type": content_type,
            "cache-control": "3600",
            "upsert": "false",
        },
    )

    return storage.get_public_url(file_path)


def delete_certificate_image(file_path: str) -> None:
    """Delete an uploaded certificate image."""

    storage = get_admin_supabase().storage.from_(CERTIFICATE_BUCKET)
    storage.remove([file_path])
