# evokAI – System Architecture (v1)

This document describes the high-level architecture of evokAI version 1.

Version 1 focuses on:
- Secure authentication
- Daily user input processing
- AI-powered analysis
- Persistent insight storage
- Clean, extensible backend design

---

## Core Components

### Client
- Android application (Kotlin)
- Handles audio recording and user interaction
- Communicates with backend via JWT-secured APIs

### Backend
- Node.js + Express
- JWT-based authentication
- Modular controller-based architecture
- Centralized error handling and rate limiting

### AI Layer
- Prompt construction
- LLM-based analysis
- Insight post-processing

### Database
- MongoDB
- Stores users, daily entries, and analysis outputs

---

## Architecture Diagrams

- `system.mmd` → Overall system architecture
- `auth-flow.mmd` → Authentication lifecycle
- `weekly-analysis.mmd` → Daily → Weekly analysis flow

---

## Versioning Notes

- v1: Core analysis & insights
- v2: Scheduled jobs, email reminders, notifications
