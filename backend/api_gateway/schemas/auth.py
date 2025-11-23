"""Authentication schemas for request/response validation."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    """Schema for user registration."""

    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    avatar: Optional[str] = "👤"


class UserLogin(BaseModel):
    """Schema for user login."""

    username: str
    password: str


class Token(BaseModel):
    """Schema for authentication token response."""

    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    """Schema for user response."""

    id: str
    username: str
    email: str
    avatar: str
    is_active: bool
    api_key: Optional[str]

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    """Schema for password change."""

    old_password: str
    new_password: str = Field(..., min_length=6)
