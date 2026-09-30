"""In-memory store. Data is lost on restart; `seed()` repopulates demo data."""

from threading import Lock
from uuid import uuid4

from pydantic import BaseModel


class Store[T: BaseModel]:
    def __init__(self) -> None:
        self._items: dict[str, T] = {}
        self._lock = Lock()

    def new_id(self) -> str:
        return uuid4().hex[:8]

    def list(self) -> list[T]:
        return list(self._items.values())

    def get(self, item_id: str) -> T | None:
        return self._items.get(item_id)

    def put(self, item_id: str, item: T) -> T:
        with self._lock:
            self._items[item_id] = item
        return item

    def delete(self, item_id: str) -> bool:
        with self._lock:
            return self._items.pop(item_id, None) is not None

    def clear(self) -> None:
        with self._lock:
            self._items.clear()
