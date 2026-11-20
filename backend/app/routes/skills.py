from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.dependencies.auth import get_current_admin
from app.schemas.skills import SkillCreate, SkillResponse, SkillUpdate
from app.services.skill_service import (
    create_skill,
    delete_skill,
    get_all_skills,
    get_skill_by_id,
    update_skill,
)

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=list[SkillResponse])
def read_skills():
    return get_all_skills()


@router.get("/{skill_id}", response_model=SkillResponse)
def read_skill(skill_id: UUID):
    skill = get_skill_by_id(skill_id)

    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found.")

    return skill


@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill_route(
    payload: SkillCreate,
    _admin=Depends(get_current_admin),
):
    return create_skill(payload.model_dump(mode="json"))


@router.patch("/{skill_id}", response_model=SkillResponse)
def update_skill_route(
    skill_id: UUID,
    payload: SkillUpdate,
    _admin=Depends(get_current_admin),
):
    data = payload.model_dump(exclude_unset=True, mode="json")

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    for required_field in ("name", "category"):
        if required_field in data and data[required_field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{required_field} cannot be null.",
            )

    skill = update_skill(skill_id, data)

    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found.")

    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill_route(
    skill_id: UUID,
    _admin=Depends(get_current_admin),
):
    if not delete_skill(skill_id):
        raise HTTPException(status_code=404, detail="Skill not found.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
