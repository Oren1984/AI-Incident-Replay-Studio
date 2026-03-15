from fastapi import APIRouter, HTTPException

from app.services.incident_service import (
    get_all_incidents,
    get_incident_by_id,
    get_replay_events,
    generate_analysis,
)

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("")
def list_incidents():
    return get_all_incidents()


@router.get("/{incident_id}")
def get_incident(incident_id: str):
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.get("/{incident_id}/replay")
def replay_incident(incident_id: str):
    events = get_replay_events(incident_id)
    if events is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return events


@router.get("/{incident_id}/analysis")
def incident_analysis(incident_id: str):
    analysis = generate_analysis(incident_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return analysis
