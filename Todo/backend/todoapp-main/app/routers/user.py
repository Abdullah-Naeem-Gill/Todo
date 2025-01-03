from fastapi import APIRouter, Depends, HTTPException
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
    access_token: Optional[str] = None  # Added access_token to return during registration

class UserRead(BaseModel):
    id: int
    username: str

@router.post("/register", response_model=UserResponse, tags=["User"])
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if the username already exists
    existing_user = await db.execute(select(User).where(User.username == user.username))
    if existing_user.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists.")
    
    # Create a new user
    new_user = User(username=user.username, hashed_password=get_password_hash(user.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate an access token after user registration
    access_token = create_access_token(data={"sub": new_user.username})

    return {"msg": "User registered successfully!", "user_id": new_user.id, "access_token": access_token}

@router.post("/login/user", response_model=UserResponse, tags=["User"])
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Retrieve user from the database
    user = await db.execute(select(User).where(User.username == form_data.username))
    user = user.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    # Generate access token on successful login
    access_token = create_access_token(data={"sub": user.username})

    return {"msg": "Login successful", "access_token": access_token, "token_type": "bearer"}


@router.get("/tasks/{user_id}", tags=["User"])
async def get_tasks(user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Retrieve the user by ID
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Retrieve tasks for the user
    assignments = await db.execute(select(TaskAssignment).where(TaskAssignment.user_id == user_id))
    tasks = [assignment.task for assignment in assignments]
    
    return {"tasks": tasks}  


@router.get("/users", response_model=List[UserRead], tags=["User"])
async def get_all_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Get all users from the database
    result = await db.execute(select(User))
    users = result.scalars().all()

    user_read_list = [UserRead(id=user.id, username=user.username) for user in users]
    return user_read_list


@router.get("/users/{user_id}", response_model=UserRead, tags=["User"])
async def get_user_by_id(user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Retrieve user by ID
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return {"id": user.id, "username": user.username}
