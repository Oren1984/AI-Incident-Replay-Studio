# AI Incident Replay Studio

AI Incident Replay Studio is an interactive incident investigation platform that replays system failures as a visual timeline experience.

Instead of showing logs as static text, the platform presents incidents as a replayable operational story:

- timeline progression
- service state transitions
- live event feed
- AI-generated narrative
- alert banners
- optional sound cues
- Docker-based local runtime

---

## Core Idea

The system simulates incident investigation as a cinematic observability experience.

It allows the user to:

- play an incident replay
- observe how a failure spreads across services
- inspect event evolution over time
- read a structured AI-style investigation summary
- experience a dashboard that feels closer to a SOC investigation tool than a standard monitoring page

---

## Architecture

Incident Data  
→ Backend API  
→ Replay Engine  
→ Frontend Visualization  
→ AI Narrative Layer

---

## Tech Stack

### Backend
- FastAPI
- Python
- Pydantic

### Frontend
- React
- Vite
- React Flow

### Runtime
- Docker
- Docker Compose
- Nginx (frontend production container)

---

## Features

- Incident dataset replay (4 built-in incidents)
- Timeline player with scrubbing
- Play / Pause / Reset controls
- Replay speed control (1x / 2x / 4x)
- Service graph visualization (ReactFlow)
- State-based node glow (healthy / warning / critical / recovering)
- Animated event feed with color-coded severity cards
- Critical alert popup overlay
- Replay summary panel after replay completes
- Rule-based AI narrative (summary, root cause, impact, operator note)
- Alert banner system
- Web Audio API sound cues (mutable, no files required)
- Health endpoint
- Dockerized runtime (nginx + FastAPI)

---

## API Endpoints

- `GET /incidents`
- `GET /incidents/{id}`
- `GET /incidents/{id}/replay`
- `GET /incidents/{id}/analysis`
- `GET /health`

---

## Project Structure

```text
ai-incident-replay-studio/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── data/
│   │   └── incidents.json
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── sounds/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## Local Run

### Docker (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- In Docker, the frontend Nginx proxies `/api/*` to the backend container.

### Without Docker

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server defaults to `http://localhost:8000` for the backend — no `.env` file needed.


## Sound System

Sound cues are synthesized in-browser using the Web Audio API — no audio files are required.

Sounds are muted by default. Click **Sound On** in the header to enable them.

Supported cues: replay start, warning event, critical failure, replay complete.

---

## Current Scope

### This version focuses on:

- replayable incident simulation

- service relationship visualization

- frontend-backend integration

- portfolio-grade observability storytelling


### Possible future upgrades:

- real LLM-generated narrative

- incident upload

- advanced timeline scrubbing

- persistent incident storage

- authentication

- multi-incident comparison

- production reverse proxy and domain deployment

---

## Portfolio Value

This project stands out because it is not just another dashboard or API.

### It combines:

- backend engineering

- replay logic

- frontend visualization

- observability concepts

- operational storytelling

- AI-style incident explanation


### That makes it a strong portfolio project for roles around:

- Applied AI Engineering

- MLOps

- Observability Engineering

- Platform Engineering

- AI Product Prototyping


---