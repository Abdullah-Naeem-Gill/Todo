from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from models import Task
from database import get_db
from pydantic import BaseModel, constr
from typing import List, Optional
from auth import get_current_user
from models import User

router = APIRouter()

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]



@router.get("/", response_model=List[TaskRead], tags=["Task Management"])
async def get_all_tasks(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tasks = await db.execute(select(Task))
    return tasks.scalars().all()

@router.get("/{task_id}", response_model=TaskRead, tags=["Task Management"])
async def get_task_by_id(task_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    task = await db.execute(select(Task).where(Task.id == task_id))
    task = task.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task

