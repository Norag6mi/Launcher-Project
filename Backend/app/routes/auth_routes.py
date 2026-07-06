from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.auth_schema import TokenResponse

from app.auth.security import verify_password
from app.auth.jwt_handler import create_access_token


router = APIRouter()


@router.post("/login", response_model=TokenResponse, tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:

        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_valid = verify_password(form_data.password, user.password)

    if not password_valid:

        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return {"access_token": access_token, "token_type": "bearer"}