from fastapi import APIRouter
from app.schemas.operations import Camera
from app.services.operations import CAMERAS
router = APIRouter(prefix="/cameras", tags=["cameras"])

@router.get("", response_model=list[Camera])
def list_cameras() -> list[Camera]:
    return CAMERAS
