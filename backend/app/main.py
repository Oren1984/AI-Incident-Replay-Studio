# app/main.py
# This file is the entry point for the FastAPI application.
# It sets up the app, configures CORS, and includes the API routes.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.incidents import router

app = FastAPI(title="AI Incident Replay Studio")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "backend",
        "project": "AI Incident Replay Studio"
    }