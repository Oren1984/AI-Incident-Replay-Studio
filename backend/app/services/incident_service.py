# app/services/incident_service.py
# This module provides functions to load incident data, retrieve specific incidents, 
# generate replay timelines, and perform analysis to produce human-readable summaries and insights.

import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "incidents.json"


def load_incidents():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_incidents():
    return load_incidents()


def get_incident(incident_id: str):
    incidents = load_incidents()
    for incident in incidents:
        if incident["incident_id"] == incident_id:
            return incident
    return None


def get_replay(incident_id: str):
    incident = get_incident(incident_id)
    if not incident:
        return None
    return sorted(incident["events"], key=lambda e: e["time"])


def _severity_label(severity: str):
    mapping = {
        "critical": "high-impact",
        "high": "serious",
        "medium": "moderate",
        "low": "limited"
    }
    return mapping.get(severity.lower(), "unknown")


def analyze_incident(incident_id: str):
    incident = get_incident(incident_id)
    if not incident:
        return None

    events = sorted(incident["events"], key=lambda e: e["time"])
    first = events[0]
    last = events[-1]

    critical_events = [
        e for e in events
        if e["event"] in ["service_crash", "timeout", "queue_overflow"]
    ]
    degraded_events = [
        e for e in events
        if e["event"] in ["latency_spike", "service_degraded", "traffic_surge"]
    ]

    likely_root = critical_events[0] if critical_events else degraded_events[0] if degraded_events else first

    impacted_services = sorted(set(
        e["service"] for e in events
        if e["service"] != "deploy"
    ))

    narrative_lines = []

    narrative_lines.append(
        f'The incident "{incident["title"]}" started at T+{first["time"]}s with {first["event"]} in {first["service"]}.'
    )

    if len(events) > 1:
        narrative_lines.append(
            f"It evolved through {len(events)} timeline events before stabilizing at T+{last['time']}s."
        )

    if degraded_events:
        degraded_desc = ", ".join(
            f'{e["service"]} ({e["event"]})' for e in degraded_events[:3]
        )
        narrative_lines.append(
            f"Early warning signals appeared in: {degraded_desc}."
        )

    if critical_events:
        critical_desc = ", ".join(
            f'{e["service"]} ({e["event"]})' for e in critical_events[:3]
        )
        narrative_lines.append(
            f"The incident became operationally significant when the following failures appeared: {critical_desc}."
        )

    summary = " ".join(narrative_lines)

    root_cause = (
        f'Likely root cause: {likely_root["event"]} affecting {likely_root["service"]}. '
        f'This appears to have triggered a cascading impact across dependent services.'
    )

    impact = (
        f'Incident severity was assessed as {incident["severity"]} '
        f'({_severity_label(incident["severity"])} impact). '
        f'Affected services: {", ".join(impacted_services)}.'
    )

    operator_note = (
        "Operator takeaway: the replay suggests that the visible failure was not the first signal. "
        "The earliest degradation point should be treated as the primary investigation anchor."
    )

    return {
        "incident_id": incident_id,
        "summary": summary,
        "root_cause": root_cause,
        "impact": impact,
        "operator_note": operator_note
    }