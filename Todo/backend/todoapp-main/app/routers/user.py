from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from models import User, TaskAssignment
from database import get_db
from auth import get_current_user, get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    msg: str
    user_id: Optional[int] = None
    access_token: Optional[str] = None 


@router.post("/register", response_model=UserResponse, tags=["User"])
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
 
    existing_user = await db.execute(select(User).where(User.username == user.username))
    if existing_user.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists."
        )
    
    new_user = User(username=user.username, hashed_password=get_password_hash(user.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.username})

    return {
        "msg": "User registered successfully!",
        "user_id": new_user.id,
        "access_token": access_token
    }

@router.post("/login/user", response_model=UserResponse, tags=["User"])
async def login(user: UserCreate, db: AsyncSession = Depends(get_db)):
   
    user_db = await db.execute(select(User).where(User.username == user.username))
    user_db = user_db.scalar_one_or_none()

    if not user_db or not verify_password(user.password, user_db.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    access_token = create_access_token(data={"sub": user_db.username})

    return {
        "msg": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/tasks/{user_id}", tags=["User"])
async def get_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
   
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    assignments = await db.execute(select(TaskAssignment).where(TaskAssignment.user_id == user_id))
    tasks = [assignment.task for assignment in assignments]
    
    return {"tasks": tasks}
