from fastapi import FastAPI
from sqlalchemy import text

from app.routes.user_routes import router as user_router
from app.routes import auth_routes
from app.routes import games
from app.routes import versions

from app.database.database import engine
from app.database.base import Base

from app.models.user import User
from app.models.game import Game
from app.models.version import Version

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(user_router)
app.include_router(auth_routes.router)
app.include_router(games.router)
app.include_router(versions.router)

# --- THE FIX: CORS UPDATE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # The wildcard: allows requests from the desktop .exe
    allow_credentials=False, # Must be False when using the "*" wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "Game Launcher Backend Running"
    }


@app.get("/health")
def health():
    with engine.connect() as connection:
        connection.execute(
            text("SELECT 1")
        )
    return {
        "status": "database connected"
    }