
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
from app.features.uploads.schemas import ImageUploadResponse
from app.features.uploads.service import (
    delete_avatar_image,
    delete_certificate_image,
    delete_project_image,
    upload_avatar_image,
    upload_certificate_image,
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


async def process_image_upload(
    file: UploadFile,
    upload_function,
    folder: str,
) -> ImageUploadResponse:
    """Validate and upload an image to the specified storage folder."""

    extension = Path(file.filename or "").suffix.lower()
    content_type = file.content_type or ""

    try:
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

        file_path = f"{folder}/{uuid4().hex}{extension}"

        try:
            image_url = upload_function(
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
        await file.close()


@router.post(
    "/projects",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_project_image_route(
    file: UploadFile = File(...),
    _admin=Depends(get_current_admin),
):
    """Upload a project image."""

    return await process_image_upload(
        file=file,
        upload_function=upload_project_image,
        folder="projects",
    )


@router.post(
    "/certificates",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_certificate_image_route(
    file: UploadFile = File(...),
    _admin=Depends(get_current_admin),
):
    """Upload a certificate image."""

    return await process_image_upload(
        file=file,
        upload_function=upload_certificate_image,
        folder="certificates",
    )


@router.post(
    "/avatars",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_avatar_image_route(
    file: UploadFile = File(...),
    _admin=Depends(get_current_admin),
):
    """Upload an admin profile avatar."""

    return await process_image_upload(
        file=file,
        upload_function=upload_avatar_image,
        folder="avatars",
    )


@router.delete(
    "/certificates/{file_path:path}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certificate_image_route(
    file_path: str,
    _admin=Depends(get_current_admin),
):
    """Delete an image stored under the certificates folder."""

    parts = file_path.split("/")

    if (
        len(parts) != 2
        or parts[0] != "certificates"
        or not parts[1]
        or parts[1] in (".", "..")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid certificate image path.",
        )

    try:
        delete_certificate_image(file_path)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to delete the certificate image.",
        ) from exc

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/avatars/{file_path:path}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_avatar_image_route(
    file_path: str,
    _admin=Depends(get_current_admin),
):
    """Delete an image stored under the avatars folder."""

    parts = file_path.split("/")

    if (
        len(parts) != 2
        or parts[0] != "avatars"
        or not parts[1]
        or parts[1] in (".", "..")
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid avatar image path.",
        )

    try:
        delete_avatar_image(file_path)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to delete the avatar image.",
        ) from exc

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/{file_path:path}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project_image_route(
    file_path: str,
    _admin=Depends(get_current_admin),
):
    """Delete an image stored under the projects folder."""

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
