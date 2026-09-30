from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel

from app import agents
from app.auth import ApiKeyDep


class ChatIn(BaseModel):
    message: str
    session_id: str | None = None


class ChatOut(BaseModel):
    reply: str
    session_id: str


router = APIRouter(prefix="/api/ai", tags=["ai"], dependencies=[ApiKeyDep])


@router.post("/chat")
def chat(body: ChatIn) -> ChatOut:
    session_id = body.session_id or uuid4().hex
    return ChatOut(reply=agents.chat(body.message, session_id), session_id=session_id)
