from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_admin
from app.features.profile.schemas import ProfileResponse, ProfileUpdate
from app.features.profile.service import (
    get_or_create_profile,
    update_profile,
)

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me", response_model=ProfileResponse)
def read_my_profile(admin=Depends(get_current_admin)):
    return get_or_create_profile(admin)


@router.patch("/me", response_model=ProfileResponse)
def update_my_profile(
    payload: ProfileUpdate,
    admin=Depends(get_current_admin),
):
    data = payload.model_dump(exclude_unset=True, mode="json")

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    if "full_name" in data and data["full_name"] is None:
        raise HTTPException(
            status_code=422,
            detail="full_name cannot be null.",
        )

    return update_profile(admin, data)
