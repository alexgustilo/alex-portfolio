from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status,
)

from app.dependencies.auth import get_current_admin
from app.schemas.uploads import ImageUploadResponse
from app.services.upload_service import (
    delete_project_image,
    upload_project_image,
)


router = APIRouter(prefix="/uploads", tags=["Uploads"])


# Only these image formats are accepted.
ALLOWED_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}

# Maximum allowed image size: 5 MB.
MAX_FILE_SIZE = 5 * 1024 * 1024


def validate_image(content: bytes, extension: str, content_type: str) -> bool:
    """Check both the declared MIME type and actual image signature."""

    expected_type = ALLOWED_TYPES.get(extension)

    if expected_type != content_type:
        return False

    # Verify the file's actual binary signature.
    if extension in (".jpg", ".jpeg"):
        return content.startswith(b"\xff\xd8\xff")

    if extension == ".png":
        return content.startswith(b"\x89PNG\r\n\x1a\n")

    if extension == ".webp":
        return (
            len(content) >= 12
            and content[:4] == b"RIFF"
            and content[8:12] == b"WEBP"
        )

    return False


@router.post(
    "/projects",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_project_image_route(
    file: UploadFile = File(...),
    _admin=Depends(get_current_admin),
):
    """Upload a project image. Only verified administrators may upload."""

    extension = Path(file.filename or "").suffix.lower()
    content_type = file.content_type or ""

    try:
        # Read one byte beyond the limit to detect oversized files.
        content = await file.read(MAX_FILE_SIZE + 1)

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="Image must not exceed 5 MB.",
            )

        if extension not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=415,
                detail="Only JPG, JPEG, PNG, and WebP images are allowed.",
            )

        if not validate_image(content, extension, content_type):
            raise HTTPException(
                status_code=415,
                detail="The file type or image content is invalid.",
            )

        # Generate a unique filename instead of trusting the original name.
        file_path = f"projects/{uuid4().hex}{extension}"

        try:
            image_url = upload_project_image(
                file_content=content,
                file_path=file_path,
                content_type=content_type,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail="Unable to upload the image to Supabase Storage.",
            ) from exc

        return ImageUploadResponse(
            image_url=image_url,
            path=file_path,
        )

    finally:
        # Release the uploaded file resource.
        await file.close()


@router.delete(
    "/{file_path:path}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project_image_route(
    file_path: str,
    _admin=Depends(get_current_admin),
):
    """Delete an image stored under the projects folder."""

    # Prevent deletion outside the projects folder.
    parts = file_path.split("/")

    if (
        len(parts) != 2
        or parts[0] != "projects"
        or not parts[1]
        or parts[1] in (".", "..")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid project image path.",
        )

    try:
        delete_project_image(file_path)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to delete the project image.",
        ) from exc

    return Response(status_code=status.HTTP_204_NO_CONTENT)
