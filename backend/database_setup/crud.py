from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from . import models, schemas


def create_task(db: Session, task: schemas.TaskCreate, page_name:str):
    try:
        db_task = models.Task(
            name = task.name,
            description = task.description,
            page_name = page_name,
            status = models.TaskStatus.pending
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)

        for subtask in task.subtasks:
            db_sub = models.Subtask(**subtask.model_dump(), task_id=db_task.id)
            db.add(db_sub)
        db.commit()
        return db_task
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_tasks(db: Session):
    try:
        return db.query(models.Task).all()
    except SQLAlchemyError as e:
        raise e

def get_task(db: Session, task_id: int):
    try:
        return db.query(models.Task).filter(models.Task.id == task_id).first()
    except SQLAlchemyError as e:
        raise e

def get_tasks_by_page(db: Session, page_name: str):
    try:
        return db.query(models.Task).filter(models.Task.page_name == page_name).all()
    except SQLAlchemyError as e:
        raise e

def start_task(db: Session, task_id: int):
    try:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task:
            task.status = models.TaskStatus.in_progress
            task.started_at = datetime.utcnow()
            db.commit()
            db.refresh(task)
        return task
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def complete_task(db: Session, task_id: int):
    try:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task:
            task.status = models.TaskStatus.completed
            task.completed_at = datetime.utcnow()
            db.commit()
            db.refresh(task)
        return task
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def delete_task(db: Session, task_id: int):
    try:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task:
            db.delete(task)
            db.commit()
        return task
    except SQLAlchemyError as e:
        db.rollback()
        raise e

# Subtasks as their own entities:
def create_subtask(db: Session, subtask: schemas.SubtaskCreate, task_id: int):
    try:
        db_subtask = models.Subtask(**subtask.model_dump(), task_id=task_id)
        db.add(db_subtask)
        db.commit()
        db.refresh(db_subtask)
        return db_subtask
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def update_subtask_status(db: Session, subtask_id: int, status: str):
    try:
        subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
        if subtask:
            # Convert string status to enum
            if status == "Pending":
                subtask.status = models.SubtaskStatus.pending
                # Reset dates when going back to pending
                subtask.started_at = None
                subtask.completed_at = None
            elif status == "In progress":
                subtask.status = models.SubtaskStatus.in_progress
                # Set started_at if not already set
                if not subtask.started_at:
                    subtask.started_at = datetime.utcnow()
                # Clear completed_at if it was set
                subtask.completed_at = None
            elif status == "Completed":
                subtask.status = models.SubtaskStatus.completed
                # Set started_at if not already set
                if not subtask.started_at:
                    subtask.started_at = datetime.utcnow()
                # Set completed_at
                subtask.completed_at = datetime.utcnow()
            
            subtask.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(subtask)
        return subtask
    except SQLAlchemyError as e:
        db.rollback()
        raise e
    
def delete_subtask(db: Session, subtask_id: int):
    try:
        subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
        if subtask:
            db.delete(subtask)
            db.commit()
        return subtask
    except SQLAlchemyError as e:
        db.rollback()
        raise e