from fastapi import APIRouter
from app.schemas.operations import Incident
from app.services.operations import INCIDENTS
router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=list[Incident])
def list_incidents() -> list[Incident]:
    return INCIDENTS
