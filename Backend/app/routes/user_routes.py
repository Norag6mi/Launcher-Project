from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.user_schema import UserCreate
from app.schemas.user_schema import UserResponse

from app.auth.security import hash_password
from app.auth.dependencies import get_current_user


router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(username=user.username, email=user.email, password=hash_password(user.password))

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


@router.get("/profile",response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):

    return current_user