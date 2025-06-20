from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi import Request
from typing import List, Optional
from datetime import datetime
from database_setup.database import get_db
from database_setup import crud, schemas
from database_setup.models import Task, TaskStatus, Subtask


router = APIRouter()


# @router.post("/api/v1/pages/Home/tasks/")
# async def create_task(request: Request):
#     body = await request.json()
#     print("Received body:", body)
@router.post("/pages/{page_name}/tasks", response_model=schemas.TaskResponse)
async def create_task(page_name: str, request: Request, db: Session = Depends(get_db)):
    try:
        # Get raw request body for debugging
        body = await request.json()
        print(f"Raw request body: {body}")
        
        # Try to parse with Pydantic
        try:
            task = schemas.TaskCreate(**body)
            print(f"Parsed task data: {task}")
        except Exception as validation_error:
            print(f"Validation error: {validation_error}")
            raise HTTPException(status_code=422, detail=f"Validation error: {str(validation_error)}")
        
        db_task = crud.create_task(db, task, page_name)
        return db_task
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error creating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

@router.get("/pages/{page_name}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks_by_page(page_name: str, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.page_name == page_name).all()
    return tasks

@router.get("/pages/Home/tasks", response_model=List[schemas.TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.page_name == "Home").all()
    return tasks

@router.put("/pages/{page_name}/tasks/{task_id}/start", response_model=schemas.TaskResponse)
def start_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.page_name == page_name).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = TaskStatus.in_progress
    db_task.started_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/pages/{page_name}/tasks/{task_id}/complete", response_model=schemas.TaskResponse)
def complete_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.page_name == page_name).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = TaskStatus.completed
    db_task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/pages/{page_name}/tasks/{task_id}")
def delete_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.page_name == page_name).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

@router.get("/tasks/analytics")
def get_task_analytics(db: Session = Depends(get_db)):
    # Fetch all tasks
    tasks = db.query(Task).all()
    analytics = {
        "overall": {"total": 0, "pending": 0, "in_progress": 0, "completed": 0},
        "by_subtasks": {"with_subtasks": 0, "without_subtasks": 0}
    }
    for task in tasks:
        analytics["overall"]["total"] += 1
        status = task.status.value if task.status else "Pending"
        if status == "Pending":
            analytics["overall"]["pending"] += 1
        elif status == "In progress":
            analytics["overall"]["in_progress"] += 1
        elif status == "Completed":
            analytics["overall"]["completed"] += 1
        
        # Count tasks with/without subtasks
        if task.subtasks:
            analytics["by_subtasks"]["with_subtasks"] += 1
        else:
            analytics["by_subtasks"]["without_subtasks"] += 1
    
    return analytics
