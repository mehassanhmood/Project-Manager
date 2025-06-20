from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
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