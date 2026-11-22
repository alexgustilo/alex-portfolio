from app.core.supabase import get_admin_supabase


# Use the existing Supabase Storage bucket.
PROJECT_BUCKET = "portfolio-projects"


def upload_project_image(
    file_content: bytes,
    file_path: str,
    content_type: str,
) -> str:
    """
    Upload an image to Supabase Storage and return its public URL.
    """

    storage = get_admin_supabase().storage.from_(PROJECT_BUCKET)

    # Upload a new uniquely named image.
    storage.upload(
        path=file_path,
        file=file_content,
        file_options={
            "content-type": content_type,
            "cache-control": "3600",
            "upsert": "false",
        },
    )

    # Generate the public URL for the uploaded image.
    return storage.get_public_url(file_path)


def delete_project_image(file_path: str) -> None:
    """
    Remove an uploaded project image from Supabase Storage.
    """

    storage = get_admin_supabase().storage.from_(PROJECT_BUCKET)

    storage.remove([file_path])
