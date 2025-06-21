"""
The pydantic models are defined here
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .models import TaskStatus, SubtaskStatus





class SubtaskBase(BaseModel):
    title: str
    description: Optional[str]
    status: SubtaskStatus = SubtaskStatus.pending


class SubtaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class SubtaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: SubtaskStatus
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    updated_at: datetime

    class Config:
        from_attributes = True

class Subtask(SubtaskBase):
    id: int
    task_id: int
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    name: str
    description: Optional[str]
    status: TaskStatus = TaskStatus.pending
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    
class TaskCreate(BaseModel):
    name: str
    description: Optional[str] = None
    subtasks: Optional[List[SubtaskCreate]] = []

class Task(TaskBase):
    id: int
    created_at: datetime
    subtasks: List[Subtask] = []

    class Config:
        from_attributes = True

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None
    status: TaskStatus
    subtasks: List[SubtaskResponse] = []
    page_name: str

    class Config:
        from_attributes = True