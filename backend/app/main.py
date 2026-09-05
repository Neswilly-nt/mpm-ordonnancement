from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.auth import router as auth_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import project as project_models  # noqa: F401
from app.models import user as user_models  # noqa: F401

Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.app_name, version="2.3.1")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
