from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    image_url: str | None = None
    live_url: str | None = None
    github_url: str | None = None
    technologies: list[str] = Field(default_factory=list)
    featured: bool = False
    display_order: int = 0


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, min_length=1)
    image_url: str | None = None
    live_url: str | None = None
    github_url: str | None = None
    technologies: list[str] | None = None
    featured: bool | None = None
    display_order: int | None = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    image_url: str | None = None
    live_url: str | None = None
    github_url: str | None = None
    technologies: list[str] = Field(default_factory=list)
    featured: bool = False
    display_order: int = 0
    created_at: datetime
    updated_at: datetime
