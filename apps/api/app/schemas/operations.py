from enum import StrEnum
from pydantic import BaseModel, Field

class RiskLevel(StrEnum):
    SAFE = "safe"
    WATCH = "watch"
    CRITICAL = "critical"

class Camera(BaseModel):
    id: str
    name: str
    location: str
    stream_type: str = "rtsp"
    online: bool = True

class Zone(BaseModel):
    id: str
    name: str
    camera_id: str
    zone_type: str
    capacity: int = Field(gt=0)
    expected_direction: str
    occupancy: int = Field(ge=0)
    risk: RiskLevel

class Incident(BaseModel):
    id: str
    title: str
    zone_id: str
    severity: RiskLevel
    detail: str
    acknowledged: bool = False
