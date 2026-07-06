from pydantic import BaseModel
from typing import List

from app.schemas.version import VersionResponse


class GameCreate(BaseModel):

    title: str
    description: str | None = None
    thumbnail_url: str | None = None
    icon_url: str | None = None


class GameResponse(BaseModel):

    id: int
    title: str
    description: str | None = None
    thumbnail_url: str | None = None
    icon_url: str | None = None

    versions: List[VersionResponse] = []

    class Config:
        from_attributes = True