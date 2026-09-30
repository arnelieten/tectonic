from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import ApiKeyDep
from app.config import CORS_ORIGINS
from app.routers import ai, items


@asynccontextmanager
async def lifespan(_: FastAPI):
    items.seed()
    yield


app = FastAPI(title="Tectonic API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(ai.router)


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/reset", tags=["meta"], dependencies=[ApiKeyDep])
def reset() -> dict[str, str]:
    items.seed()
    return {"status": "reset"}
