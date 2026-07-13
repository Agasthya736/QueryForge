# QueryForge

A multi-agent SQL/MongoDB learning platform with AI-generated animations,
adaptive difficulty (beginner/intermediate/advanced), and mock technical
interview mode with rubric-based evaluation.

## Repo layout
- `frontend/` — Next.js app (Monaco editor, animation renderers, chat/interview UI)
- `backend/` — Spring Boot Core API (auth, curriculum, session orchestration)
- `agent-service/` — FastAPI + LangGraph multi-agent system (Tutor, Interviewer,
  Evaluator, Animation Generator, Orchestrator)
- `sandbox-service/` — isolated query execution per engine (SQLite, Postgres,
  MySQL, MongoDB)
- `docs/` — system design docs

## Architecture at a glance
```
Frontend (Next.js)
      │
      ▼
Core API (Spring Boot) ── talks to ──▶ Agent Service (FastAPI/LangGraph)
      │                                        │
      └──────────────▶ Sandbox Service ◀───────┘
```
Frontend only ever talks to the Core API. The Core API brokers all calls to
the Agent Service and Sandbox Service, so credentials and API keys never
reach the client.

See `docs/system-design.md` for the full design.
