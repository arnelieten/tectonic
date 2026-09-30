from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.config import API_KEY


def require_api_key(x_api_key: Annotated[str | None, Header()] = None) -> None:
    if x_api_key != API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


ApiKeyDep = Depends(require_api_key)
