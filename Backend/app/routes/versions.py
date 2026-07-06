from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.game import Game
from app.models.version import Version

from app.schemas.version import (VersionCreate, VersionResponse)

router = APIRouter(prefix="/versions", tags=["Versions"])


@router.post("", response_model=VersionResponse)
def create_version(version: VersionCreate, db: Session = Depends(get_db)):

    game = (db.query(Game).filter(Game.id == version.game_id).first())

    if not game:

        raise HTTPException(status_code=404, detail="Game not found")

    new_version = Version(
        game_id=version.game_id,
        version=version.version,
        download_url=version.download_url,
        release_notes=version.release_notes,
        file_name=version.file_name,
        package_size=version.package_size,
        executable_name=version.executable_name
    )

    db.add(new_version)

    db.commit()

    db.refresh(new_version)

    return new_version


@router.get("", response_model=list[VersionResponse])
def get_versions(db: Session = Depends(get_db)):

    versions = db.query(Version).all()

    return versions


@router.get("/{version_id}", response_model=VersionResponse)
def get_version(version_id: int, db: Session = Depends(get_db)):

    version = (db.query(Version).filter(Version.id == version_id).first())

    if not version:

        raise HTTPException(status_code=404, detail="Version not found")

    return version