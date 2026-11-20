from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class MessageStatus(str, Enum):
    unread = "unread"
    read = "read"
    replied = "replied"
    archived = "archived"


class MessageUpdate(BaseModel):
    status: MessageStatus


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: EmailStr
    subject: str | None = None
    message: str
    status: MessageStatus
    created_at: datetime
