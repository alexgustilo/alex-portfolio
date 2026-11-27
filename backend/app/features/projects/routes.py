from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.dependencies.auth import get_current_admin
from app.features.projects.schemas import ProjectCreate, ProjectResponse, ProjectUpdate
from app.features.projects.service import (
    create_project,
    delete_project,
    get_all_projects,
    get_project_by_id,
    update_project,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def read_projects():
    return get_all_projects()


@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(project_id: UUID):
    project = get_project_by_id(project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found.")

    return project


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_route(
    payload: ProjectCreate,
    _admin=Depends(get_current_admin),
):
    return create_project(payload.model_dump(mode="json"))


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project_route(
    project_id: UUID,
    payload: ProjectUpdate,
    _admin=Depends(get_current_admin),
):
    data = payload.model_dump(exclude_unset=True, mode="json")

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")

    for required_field in ("title", "description"):
        if required_field in data and data[required_field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{required_field} cannot be null.",
            )

    project = update_project(project_id, data)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found.")

    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_route(
    project_id: UUID,
    _admin=Depends(get_current_admin),
):
    deleted = delete_project(project_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
