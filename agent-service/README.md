# QueryForge — Agent Service (FastAPI + LangGraph)

## Structure
- `main.py` — FastAPI app, `/orchestrate` entry point called by Core API
- `agents/` — one file per specialist: `orchestrator`, `tutor_agent`, `interviewer_agent`, `evaluator_agent`, `animation_agent`
- `tools/` — `sandbox_tool.py` wraps calls to the Sandbox Service (`run_sql`)
- `models/` — shared Pydantic schemas (`AnimationStep`, `EvaluationResult`, etc.)

## Design notes
- Stateless per-request — session state (level, language, dialect, mistake history) is passed in from Core API each call, not stored here.
- The Animation Generator never emits raw UI code — only fills the `render_animation` schema (`scene_type` + `steps`) that the frontend's fixed renderer components consume.
- Evaluator compares SQL by **result set**, not string-matching against a reference query.

## Setup
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
