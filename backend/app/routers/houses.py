from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.auth import ApiKeyDep
from app.houses import House, get_house, query_houses

router = APIRouter(prefix="/api/houses", tags=["houses"], dependencies=[ApiKeyDep])


@router.get("")
def list_houses(
    min_price: Annotated[int | None, Query(ge=0)] = None,
    max_price: Annotated[int | None, Query(ge=0)] = None,
    min_bedrooms: Annotated[int | None, Query(ge=0)] = None,
    property_type: Annotated[str | None, Query()] = None,
) -> list[House]:
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot exceed max_price")
    return query_houses(
        min_price=min_price,
        max_price=max_price,
        min_bedrooms=min_bedrooms,
        property_type=property_type,
    )


@router.get("/{house_id}")
def read_house(house_id: int) -> House:
    house = get_house(house_id)
    if house is None:
        raise HTTPException(status_code=404, detail="House not found")
    return house


@router.get("/{house_id}/image")
def read_house_image(house_id: int) -> FileResponse:
    house = get_house(house_id)
    if house is None or not house.image_path.is_file():
        raise HTTPException(status_code=404, detail="House image not found")
    return FileResponse(house.image_path, media_type="image/jpeg")
