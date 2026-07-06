from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)

    description = Column(Text)

    thumbnail_url = Column(String(255))

    icon_url = Column(String(255))

    versions = relationship("Version", back_populates="game", cascade="all, delete")