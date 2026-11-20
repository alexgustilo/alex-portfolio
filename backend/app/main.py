from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.auth import router as auth_router
from app.routes.certificates import router as certificates_router
from app.routes.contact import router as contact_router
from app.routes.messages import router as messages_router
from app.routes.profile import router as profile_router
from app.routes.projects import router as projects_router
from app.routes.skills import router as skills_router


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for the Alex Portfolio website.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# all API routers
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(projects_router, prefix=settings.api_prefix)
app.include_router(skills_router, prefix=settings.api_prefix)
app.include_router(certificates_router, prefix=settings.api_prefix)
app.include_router(contact_router, prefix=settings.api_prefix)
app.include_router(messages_router, prefix=settings.api_prefix)
app.include_router(profile_router, prefix=settings.api_prefix)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": f"{settings.app_name} is running",
        "version": settings.app_version,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
    }
