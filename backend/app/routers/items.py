from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.auth import ApiKeyDep
from app.store import Store


class ItemIn(BaseModel):
    title: str
    description: str = ""


class Item(ItemIn):
    id: str


items = Store[Item]()

router = APIRouter(prefix="/api/items", tags=["items"], dependencies=[ApiKeyDep])


def seed() -> None:
    items.clear()
    for title, description in [
        ("First thing", "Seeded demo data"),
        ("Second thing", "Edit backend/app/routers/items.py to change me"),
    ]:
        item_id = items.new_id()
        items.put(item_id, Item(id=item_id, title=title, description=description))


@router.get("")
def list_items() -> list[Item]:
    return items.list()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_item(body: ItemIn) -> Item:
    item_id = items.new_id()
    return items.put(item_id, Item(id=item_id, **body.model_dump()))


@router.get("/{item_id}")
def get_item(item_id: str) -> Item:
    item = items.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: str) -> None:
    if not items.delete(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
