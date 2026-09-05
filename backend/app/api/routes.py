from fastapi import APIRouter, Depends, HTTPException

from app.api.auth import current_user
from app.models.user import User
from app.schemas.mpm import MPMRequest, MPMResponse
from app.services.mpm import MPMValidationError, analyze_mpm

router = APIRouter(tags=["MPM"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "method": "MPM"}


@router.post("/mpm/analyze", response_model=MPMResponse)
def analyze(payload: MPMRequest, _user: User = Depends(current_user)) -> MPMResponse:
    try:
        return analyze_mpm(payload)
    except MPMValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
