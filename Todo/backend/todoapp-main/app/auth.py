from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from models import User
from database import get_db
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List

router = APIRouter()

SECRET_KEY = "11"  # This should be stored securely, not hard-coded
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str
    roles: List[str]


class RegisterRequest(BaseModel):
    username: str
    password: str
    is_admin: bool = False  # Add a flag to check if the user is an admin


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, roles=payload.get("roles", []))
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.username == token_data.username))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register/admin", response_model=Token, tags=["Auth"])
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    username = request.username
    password = request.password
    is_admin = request.is_admin  # Get the is_admin flag from the request

    # Check if the username already exists
    result = await db.execute(select(User).where(User.username == username))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")

    # Hash the password and save the new user
    hashed_password = get_password_hash(password)
    new_user = User(username=username, hashed_password=hashed_password)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Create an access token with the "admin" role if the user is an admin
    roles = ["admin"] if is_admin else []
    access_token = create_access_token(data={"sub": new_user.username, "roles": roles})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token", response_model=Token, tags=["Auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Retrieve the user by username
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalar_one_or_none()

    # If the user does not exist or the password is incorrect, raise an exception
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Define roles for the user, assign "admin" role if the user is an admin
    roles = ["admin"] if user.username == "admin" else []  # Adjust this logic based on your needs

    # Create an access token with the user's username and roles
    access_token = create_access_token(data={"sub": user.username, "roles": roles})

    return {"access_token": access_token, "token_type": "bearer"}
