# AI Agent Execution Guide

Project: AI Incident Replay Studio

This document provides instructions for automated agents responsible for completing and validating the system.

## Objectives

Ensure the system runs fully with:

* working backend API
* functional frontend visualization
* replay engine
* AI narrative explanations
* sound alerts
* dockerized deployment

## Required Capabilities

The system must demonstrate:

1. Incident loading
2. Timeline replay
3. Service state visualization
4. Event feed updates
5. AI explanation panel
6. Optional sound alerts

## Backend

Framework: FastAPI

Required endpoints:

GET /incidents
GET /incidents/{id}
GET /incidents/{id}/replay
GET /incidents/{id}/analysis

## Frontend

Framework: React

Required layout sections:

Header
Timeline
System Graph
Event Feed
AI Narrative

## Replay Engine

The replay engine must:

* sort events by time
* emit events sequentially
* update timeline progress
* update service states

## Sound Layer

Sound triggers:

* replay start
* warning alert
* critical failure
* replay complete

Mute control must be available.

## Docker

The system must run using:

docker compose up --build

Containers:

frontend
backend

## Expected Final Result

A cinematic incident investigation dashboard where users can replay system failures and visually analyze how incidents propagate across services.
