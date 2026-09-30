# Tectonic

Hackathon project. This is a demo, not production code: the API key is hardcoded and the data is stored in memory, so a restart resets it.

## Setup & Running Application

### Setup

```bash
npm run setup                   # once
cp backend/.env.example backend/.env # add GOOGLE_API_KEY (Gemini)
```

### Run Frontend

```bash
cd frontend
npm run dev
```

### Run Backend

```bash
cd backend
uv run fastapi dev --port 8000
```


## Layout

- `backend/app/main.py` creates the app and registers the routers
- `backend/app/routers/`: one file per feature. Copy `items.py` to start a new resource
- `backend/app/store.py`: the in-memory `Store[Model]`
- `backend/app/agents.py`: [Agno](https://docs.agno.com) agents on Gemini. `chat()` returns a mock reply when no key is set. Add tools as plain Python functions with a docstring. Chat history is kept per `session_id` in Agno's `InMemoryDb`
- `POST /api/reset` restores the seed data, which is handy before a demo
- `frontend/src/api.ts`: fetch wrapper that adds the API key
- `frontend/src/App.tsx`: starter page

## Agent skills

These live in `.agents/skills/`

- `fastapi`: the official FastAPI conventions
- `frontend-design`: Anthropic's skill for building a distinctive UI
