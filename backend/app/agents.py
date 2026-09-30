from functools import cache

from agno.agent import Agent
from agno.db.in_memory import InMemoryDb
from agno.models.google import Gemini

from app.config import GEMINI_MODEL, GOOGLE_API_KEY
from app.routers.items import items

db = InMemoryDb()


def list_items() -> list[dict]:
    """List all items currently stored in the app."""
    return [item.model_dump() for item in items.list()]


@cache
def assistant() -> Agent:
    return Agent(
        name="assistant",
        model=Gemini(id=GEMINI_MODEL, api_key=GOOGLE_API_KEY),
        instructions="You are a helpful assistant for the Tectonic app. Be concise.",
        tools=[list_items],
        db=db,
        add_history_to_context=True,
        markdown=True,
    )


def chat(message: str, session_id: str) -> str:
    if not GOOGLE_API_KEY:
        return f"[mock reply - set GOOGLE_API_KEY in backend/.env] You said: {message}"
    return str(assistant().run(message, session_id=session_id).content)
