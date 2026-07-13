"""Routes incoming requests to the correct specialist agent based on
user intent and session state (level, mode: learn/practice/interview)."""


def route(user_message: str, session_state: dict) -> str:
    # TODO: intent classification -> "tutor" | "interviewer" | "evaluator" | "animation"
    raise NotImplementedError
