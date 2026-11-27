from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    proficiency: int = Field(default=0, ge=0, le=100)
    icon: str | None = None
    display_order: int = 0


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    proficiency: int | None = Field(default=None, ge=0, le=100)
    icon: str | None = None
    display_order: int | None = None


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    category: str
    proficiency: int = 0
    icon: str | None = None
    display_order: int = 0
    created_at: datetime
    updated_at: datetime
