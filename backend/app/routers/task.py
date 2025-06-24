from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi import Request
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from database_setup.database import get_db
from database_setup import crud, schemas
from database_setup.models import Task, TaskStatus, Subtask


router = APIRouter()

# Pydantic model for status updates
class StatusUpdate(BaseModel):
    status: str


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
    try:
        tasks = crud.get_tasks_by_page(db, page_name)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

@router.get("/pages/Home/tasks", response_model=List[schemas.TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    try:
        tasks = crud.get_tasks_by_page(db, "Home")
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

@router.get("/tasks/all", response_model=List[schemas.TaskResponse])
def get_all_tasks_from_all_pages(db: Session = Depends(get_db)):
    try:
        tasks = crud.get_tasks(db)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching all tasks: {str(e)}")

@router.put("/pages/{page_name}/tasks/{task_id}/start", response_model=schemas.TaskResponse)
def start_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    try:
        db_task = crud.start_task(db, task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting task: {str(e)}")

@router.put("/pages/{page_name}/tasks/{task_id}/complete", response_model=schemas.TaskResponse)
def complete_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    try:
        db_task = crud.complete_task(db, task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error completing task: {str(e)}")

@router.delete("/pages/{page_name}/tasks/{task_id}")
def delete_task(page_name: str, task_id: int, db: Session = Depends(get_db)):
    try:
        db_task = crud.delete_task(db, task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")

@router.get("/tasks/analytics")
def get_task_analytics(db: Session = Depends(get_db)):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")


# Subtask endpoints
@router.post("/tasks/{task_id}/subtasks", response_model=schemas.SubtaskResponse)
def create_subtask(task_id: int, subtask: schemas.SubtaskCreate, db: Session = Depends(get_db)):
    try:
        # Verify task exists
        task = crud.get_task(db, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        db_subtask = crud.create_subtask(db, subtask, task_id)
        return db_subtask
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating subtask: {str(e)}")

@router.put("/subtasks/{subtask_id}/status", response_model=schemas.SubtaskResponse)
def update_subtask_status(subtask_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    try:
        # Validate status
        valid_statuses = ["Pending", "In progress", "Completed"]
        if status_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        db_subtask = crud.update_subtask_status(db, subtask_id, status_update.status)
        if not db_subtask:
            raise HTTPException(status_code=404, detail="Subtask not found")
        return db_subtask
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating subtask status: {str(e)}")

@router.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    try:
        db_subtask = crud.delete_subtask(db, subtask_id)
        if not db_subtask:
            raise HTTPException(status_code=404, detail="Subtask not found")
        return {"message": "Subtask deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting subtask: {str(e)}")