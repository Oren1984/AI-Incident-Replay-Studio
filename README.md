# NeuroOps Incident Replay

AI-powered incident investigation platform that replays system failures as an interactive, timeline-driven experience.

Instead of static logs, the system presents incidents as a dynamic operational story — combining visualization, replay logic, and AI-style explanations.

---

## Core Capabilities

- Timeline-based incident replay
- Service state transitions visualization
- Live event stream with severity levels
- AI-style incident narrative (summary, root cause, impact)
- Alert banners and critical overlays
- Replay controls (play, pause, speed, reset)
- Sound cues (Web Audio API, optional)

---

## Core Idea

The platform transforms incident investigation into a **cinematic observability experience**.

Users can:

- Replay incidents step-by-step
- Observe failure propagation across services
- Inspect event sequences in real time
- Understand incidents through structured AI explanations

---

## Architecture

Incident Data
→ Backend API (FastAPI)
→ Replay Engine
→ Frontend Visualization (React + ReactFlow)
→ AI Narrative Layer

---

## Tech Stack

**Backend**
Python • FastAPI • Pydantic

**Frontend**
React • Vite • ReactFlow

**Runtime**
Docker • Docker Compose • Nginx

---

## Run Instructions

### Docker (recommended):

```bash
docker compose up --build
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

### Local (without Docker):

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## Summary

NeuroOps Incident Replay demonstrates how incident investigation can evolve from static logs into an interactive, visual, and explainable experience.
