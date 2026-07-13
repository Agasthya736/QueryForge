from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="QueryForge Agent Service")


class OrchestratorRequest(BaseModel):
    session_id: str
    user_message: str
    level: str  # beginner | intermediate | advanced
    language: str  # sql | mongodb
    dialect: str | None = None  # mysql | postgres | sqlite (when language == "sql")


@app.post("/orchestrate")
async def orchestrate(req: OrchestratorRequest):
    """
    Entry point called by the Core API. Routes to the appropriate
    specialist agent (Tutor / Interviewer / Evaluator / AnimationGenerator)
    based on user_message intent and session state.
    """
    # TODO: route via agents/orchestrator.py
    return {"status": "not_implemented", "received": req.model_dump()}


@app.get("/health")
async def health():
    return {"status": "ok"}
