from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.game import Game
from app.models.version import Version

from app.schemas.game import (GameCreate, GameResponse)
from app.schemas.version import VersionResponse
from app.schemas.version import (VersionResponse, UpdateCheckResponse)

router = APIRouter(prefix="/games", tags=["Games"])


@router.post("", response_model=GameResponse)
def create_game(game: GameCreate, db: Session = Depends(get_db)):

    new_game = Game(title=game.title, description=game.description, thumbnail_url=game.thumbnail_url, icon_url=game.icon_url)

    db.add(new_game)

    db.commit()

    db.refresh(new_game)

    return new_game


@router.get("", response_model=list[GameResponse])
def get_games(db: Session = Depends(get_db)):

    games = db.query(Game).all()

    return games


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db)):

    game = (db.query(Game).filter(Game.id == game_id).first())

    if not game:

        raise HTTPException(status_code=404, detail="Game not found")

    return game


@router.get("/{game_id}/versions")
def get_game_versions(game_id: int, db: Session = Depends(get_db)):

    game = (db.query(Game).filter(Game.id == game_id).first())

    if not game:

        raise HTTPException(status_code=404, detail="Game not found")

    return game.versions


@router.get("/{game_id}/latest-version", response_model=VersionResponse)
def get_latest_version(game_id: int, db: Session = Depends(get_db)):

    game = (db.query(Game).filter(Game.id == game_id).first())

    if not game:

        raise HTTPException(status_code=404,detail="Game not found")

    latest_version = (db.query(Version).filter(Version.game_id == game_id).order_by(Version.id.desc()).first())

    if not latest_version:

        raise HTTPException(status_code=404, detail="No versions found")

    return latest_version


@router.get("/{game_id}/check-update/{installed_version}", response_model=UpdateCheckResponse)
def check_update(game_id: int, installed_version: str, db: Session = Depends(get_db)):

    latest_version = (db.query(Version).filter(Version.game_id == game_id).order_by(Version.id.desc()).first())

    if not latest_version:

        raise HTTPException(status_code=404, detail="No versions found")

    update_available = (latest_version.version != installed_version)

    return {"update_available":update_available,

        "latest_version":
            latest_version.version,

        "download_url":
            latest_version.download_url if update_available else None,
        
        "release_notes":
            latest_version.release_notes
    }