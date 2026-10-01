from fastapi import APIRouter
from app.schemas.operations import Zone
from app.services.operations import ZONES
router = APIRouter(prefix="/zones", tags=["zones"])

@router.get("", response_model=list[Zone])
def list_zones() -> list[Zone]:
    return ZONES
