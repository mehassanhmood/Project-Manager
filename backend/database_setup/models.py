"""
enum:
    For defining task/subtask statuses and priorities
enum.Enum:
    Defines valid values for specific columns using Python enum.Enum
    Helps with validation, autocomplete, and readability.
Enum (SQLAlchemy):
    Tells sqlalchemy to use values from TaskStatus in the actual database schema.
    Ensures that only valid enum values can be inserted into the column
    Can optionally generate a SQL `CHECK` constraint.
How enum.Enum and enum work together:
    Defining a Python Enum (TaskStatus) for code readability and consistency.
    Using it inside a SQLAlchemy Enum column, which enforces it at the DB level.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import enum


from .database import Base

class TaskStatus(str, enum.Enum):
    pending = "Pending"
    in_progress = "In progress"
    completed = "Completed"

class SubtaskStatus(str, enum.Enum):
    pending = "Pending"
    in_progress = "In progress"
    completed = "Completed"

class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True)
    page_name = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)

    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_task_status", "status"),
    )

class Subtask(Base):
    __tablename__ = "subtask"

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("task.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(SubtaskStatus), nullable=False, default=SubtaskStatus.pending)
    task = relationship("Task", back_populates="subtasks")

    __table_args__ = (
        Index("idx_subtask_status", "status"),
    )
