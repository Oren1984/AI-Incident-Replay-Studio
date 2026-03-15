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

- Incident dataset replay
- Timeline player
- Play / Pause / Reset controls
- Replay speed control
- Service graph visualization
- State-based node coloring
- Event feed
- Rule-based AI narrative
- Alert banner system
- Sound cue support
- Health endpoint
- Dockerized runtime

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

```bash
docker compose up --build
```
---

## Services

- Frontend: http://localhost:5173

- Backend: http://localhost:8000

- Backend health: http://localhost:8000/health

---

## Sound Files

Place these files under:

frontend/public/sounds/

Expected filenames:

- start.mp3

- warning.mp3

- critical.mp3

- complete.mp3

If sound files are missing, the application UI still works, but audio playback will not be available.

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