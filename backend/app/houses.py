"""House catalog loaded from JSON into a dict keyed by id."""

import json
from pathlib import Path

from pydantic import BaseModel, Field

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_PATH = DATA_DIR / "houses.json"


class House(BaseModel):
    id: int
    title: str
    address: str
    price: int = Field(gt=0)
    currency: str
    bedrooms: int
    bathrooms: float
    sqft: int
    property_type: str
    description: str
    reason: str
    image: str

    @property
    def image_path(self) -> Path:
        return DATA_DIR / self.image


def load_houses() -> dict[int, House]:
    records = json.loads(DATA_PATH.read_text())
    houses = [House.model_validate(record) for record in records]
    return {house.id: house for house in houses}


HOUSES: dict[int, House] = load_houses()


def get_house(house_id: int) -> House | None:
    return HOUSES.get(house_id)


def query_houses(
    *,
    min_price: int | None = None,
    max_price: int | None = None,
    min_bedrooms: int | None = None,
    property_type: str | None = None,
) -> list[House]:
    matches = []
    for house in HOUSES.values():
        if min_price is not None and house.price < min_price:
            continue
        if max_price is not None and house.price > max_price:
            continue
        if min_bedrooms is not None and house.bedrooms < min_bedrooms:
            continue
        if property_type is not None and house.property_type != property_type:
            continue
        matches.append(house)
    return sorted(matches, key=lambda house: house.id)
