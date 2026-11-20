from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, repr=False)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=1, repr=False)
