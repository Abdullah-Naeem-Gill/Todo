from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from models import User, Task, TaskAssignment
from database import get_db
from auth import get_current_user 
from pydantic import BaseModel, constr
from typing import List, Optional

router = APIRouter()

class TaskResponse(BaseModel):
    msg: str
    task_id: Optional[int] = None

class TaskCreate(BaseModel):
    title: constr(min_length=1, max_length=100) 
    description: Optional[constr(max_length=500)] = None

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]

class UserRead(BaseModel):
    id: int
    username: str


@router.post("/createTask", response_model=TaskResponse, tags=["Admin"])
async def create_task(task_create: TaskCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
   
    new_task = Task(**task_create.dict())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return {"msg": "Task created", "task_id": new_task.id}


@router.get("/getTasks", response_model=List[TaskRead], tags=["Task Management"])
async def get_all_tasks(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tasks = await db.execute(select(Task))
    return tasks.scalars().all()

@router.post("/assign-task", tags=["Admin"])
async def assign_task(task_id: int, user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    task = await db.execute(select(Task).where(Task.id == task_id))
    user = await db.execute(select(User).where(User.id == user_id))
    
    task = task.scalar_one_or_none()
    user = user.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    task_assignment = TaskAssignment(user_id=user_id, task_id=task_id)
    db.add(task_assignment)
    await db.commit()
    await db.refresh(task_assignment)

    return {"msg": "Task assigned successfully", "task_assignment_id": task_assignment.id}

@router.delete("/delete-task/{task_id}", response_model=TaskResponse, tags=["Admin"])
async def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    task = await db.execute(select(Task).where(Task.id == task_id))
    task = task.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()
    
    return {"msg": "Task deleted successfully", "task_id": task_id}


@router.delete("/unassign-task/{task_id}/{user_id}", tags=["Admin"])
async def unassign_task(task_id: int, user_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    assignment = await db.execute(select(TaskAssignment).where(TaskAssignment.task_id == task_id, TaskAssignment.user_id == user_id))
    assignment = assignment.scalar_one_or_none()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Task not assigned to this user.")
    
    await db.delete(assignment)
    await db.commit()
    return {"msg": "Task unassigned successfully"}


@router.put("/update-task/{task_id}", tags=["Admin"])
async def update_task(task_id: int, task_create: TaskCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    task = await db.execute(select(Task).where(Task.id == task_id))
    task = task.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = task_create.title
    task.description = task_create.description
    await db.commit()
    return {"msg": "Task updated"}

    
@router.get("/users", response_model=List[UserRead], tags=["Admin"])
async def get_all_users(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User))
    users = result.scalars().all()

    user_read_list = [UserRead(id=user.id, username=user.username) for user in users]
    return user_read_list

@router.get("/users/{user_id}", response_model=UserRead, tags=["Admin"])
async def get_user_by_id(
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
    
    return {"id": user.id, "username": user.username}
