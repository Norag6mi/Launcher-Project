from pydantic import BaseModel


class VersionCreate(BaseModel):

    game_id: int
    version: str
    download_url: str
    release_notes: str | None = None
    file_name: str
    package_size: int
    executable_name: str | None = None

class VersionResponse(BaseModel):

    id: int
    version: str
    download_url: str
    release_notes: str | None = None
    file_name: str
    package_size: int
    executable_name: str | None = None

    class Config:
        from_attributes = True

class UpdateCheckResponse(BaseModel):

    update_available: bool
    latest_version: str
    download_url: str | None = None
    release_notes: str | None = None