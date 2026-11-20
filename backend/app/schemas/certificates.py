from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CertificateCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    issuer: str = Field(min_length=1, max_length=150)
    issue_date: date | None = None
    credential_url: str | None = None
    image_url: str | None = None
    description: str | None = None
    display_order: int = 0


class CertificateUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    issuer: str | None = Field(default=None, min_length=1, max_length=150)
    issue_date: date | None = None
    credential_url: str | None = None
    image_url: str | None = None
    description: str | None = None
    display_order: int | None = None


class CertificateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    issuer: str
    issue_date: date | None = None
    credential_url: str | None = None
    image_url: str | None = None
    description: str | None = None
    display_order: int = 0
    created_at: datetime
    updated_at: datetime
