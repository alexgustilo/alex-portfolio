from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.core.config import settings
from app.dependencies.auth import get_current_user, security
from app.schemas.auth import LoginRequest, RefreshRequest
from app.services.auth_service import (
    login_admin,
    logout_user,
    refresh_admin_session,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(payload: LoginRequest):
    try:
        return login_admin(payload.email, payload.password)
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign-in failed. Check your credentials and Supabase Auth settings.",
        ) from exc


@router.post("/refresh")
def refresh_session(payload: RefreshRequest):
    try:
        return refresh_admin_session(payload.refresh_token)
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail="Refresh token is invalid or expired.",
        ) from exc


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": getattr(user, "email", None),
        "app_metadata": getattr(user, "app_metadata", None) or {},
        "user_metadata": getattr(user, "user_metadata", None) or {},
    }


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    _user=Depends(get_current_user),
):
    try:
        logout_user(credentials.credentials)
        return {"message": "Current session signed out successfully."}
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Unable to sign out this session.",
        ) from exc
