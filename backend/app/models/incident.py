from pydantic import BaseModel
from typing import List


class IncidentEvent(BaseModel):
    time: int
    service: str
    event: str
    message: str


class Incident(BaseModel):
    incident_id: str
    title: str
    severity: str
    status: str
    services: List[str]
    events: List[IncidentEvent]
