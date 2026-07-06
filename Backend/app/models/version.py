from sqlalchemy import (Column, Integer, String, ForeignKey)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Version(Base):

    __tablename__ = "versions"

    id = Column(Integer, primary_key=True, index=True)

    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)

    version = Column(String(20), nullable=False)

    download_url = Column(String(255), nullable=False)

    release_notes = Column(String(500))

    file_name = Column(String(255), nullable=False)

    package_size = Column(Integer, nullable=False)
    
    executable_name = Column(String(255), nullable=True)

    game = relationship("Game", back_populates="versions")

    