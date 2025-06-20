# Database Setup and Task Router Guide

## Overview
This document explains how the Buraq Manager database is set up and how the task management system works. Everything is written in simple English to help you understand the code structure.

## Database Setup Folder Structure

```
database_setup/
├── database.py      # Database connection and session management
├── models.py        # Database table definitions (Task and Subtask)
├── schemas.py       # Data validation models (Pydantic)
└── crud.py          # Database operations (Create, Read, Update, Delete)
```

---

## 1. Database Connection (`database.py`)

### What This File Does
This file sets up the connection to the database and creates a way for the application to talk to it.

### Code Explanation

```python
DATABASE_URL = "sqlite:///./buraq_manager.db"
```
- **What it does**: Tells the app where to find the database file
- **Simple explanation**: "Use a file called 'buraq_manager.db' in the current folder"

```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```
- **What it does**: Creates a database engine (like a car engine, but for databases)
- **Simple explanation**: "Make a tool that can talk to our database file"

```python
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
```
- **What it does**: Creates a factory for database sessions
- **Simple explanation**: "Create a template for making database conversations"

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
- **What it does**: Provides a database session for each request
- **Simple explanation**: "Give me a database conversation, and when I'm done, close it properly"

---

## 2. Database Models (`models.py`)

### What This File Does
This file defines what our database tables look like and what data they can store.

### Task Status Enum
```python
class TaskStatus(str, enum.Enum):
    pending = "Pending"
    in_progress = "In progress"
    completed = "Completed"
```
- **What it does**: Defines the possible states a task can be in
- **Simple explanation**: "A task can only be in one of these three states: waiting to start, currently working on it, or finished"

### Task Table Definition
```python
class Task(Base):
    __tablename__ = "task"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
```

**Field by Field Explanation:**
- `id`: A unique number for each task (like a serial number)
- `name`: The title of the task (required - can't be empty)
- `description`: Details about what the task involves (optional)
- `status`: Current state of the task (pending, in progress, or completed)
- `created_at`: When the task was first created (automatically set)
- `started_at`: When someone started working on the task (optional)
- `completed_at`: When the task was finished (optional)

### Subtask Table Definition
```python
class Subtask(Base):
    __tablename__ = "subtask"
    
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("task.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(SubtaskStatus), nullable=False, default=SubtaskStatus.pending)
```

**Field by Field Explanation:**
- `id`: A unique number for each subtask
- `task_id`: Links this subtask to a specific task (like a parent-child relationship)
- `title`: The name of the subtask (required)
- `description`: Details about the subtask (optional)
- `status`: Current state of the subtask

### Relationship Definition
```python
subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")
```
- **What it does**: Links tasks to their subtasks
- **Simple explanation**: "When you delete a task, also delete all its subtasks"

---

## 3. Data Validation Schemas (`schemas.py`)

### What This File Does
This file defines how data should look when it comes in and goes out of the API. It's like a security guard that checks if data is correct.

### Subtask Schemas
```python
class SubtaskBase(BaseModel):
    title: str
    description: Optional[str]
    status: SubtaskStatus = SubtaskStatus.pending
    order: int = 0
```
- **What it does**: Defines the basic structure for subtask data
- **Simple explanation**: "When someone sends subtask data, it must have a title, can have a description, and starts as pending"

### Task Schemas
```python
class TaskBase(BaseModel):
    name: str
    description: Optional[str]
    status: TaskStatus = TaskStatus.pending
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    component: Optional[str]
```
- **What it does**: Defines the basic structure for task data
- **Simple explanation**: "When someone sends task data, it must have a name, can have a description, and starts as pending"

---

## 4. Database Operations (`crud.py`)

### What This File Does
This file contains functions that actually do things with the database (create, read, update, delete).

### Create Task Function
```python
def create_task(db: Session, task: schemas.TaskCreate):
    try:
        db_task = models.Task(**task.dict(exclude={"subtasks"}))
        db.add(db_task)
        db.commit()
        db.refresh(db_task)

        for subtask in task.subtasks:
            db_sub = models.Subtask(**subtask.dict(), task_id=db_task.id)
            db.add(db_sub)
        db.commit()
        return db_task
    except SQLAlchemyError as e:
        db.rollback()
        raise e
```

**Step by Step Explanation:**
1. **Create the task**: Take the task data and make a new task in the database
2. **Save the task**: Put the task into the database and get it back with an ID
3. **Create subtasks**: For each subtask, create it and link it to the task
4. **Handle errors**: If something goes wrong, undo all changes

---

## 5. Task Router (`app/routers/task.py`)

### What This File Does
This file handles all the web requests related to tasks (create, read, update, delete).

### Request/Response Models
```python
class TaskCreate(TaskBase):
    subtasks: Optional[List[SubtaskCreate]] = []

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None
    status: str
    subtasks: List[SubtaskResponse] = []
```

**Explanation:**
- `TaskCreate`: What the frontend sends when creating a task
- `TaskResponse`: What the backend sends back after creating a task

### Create Task Endpoint
```python
@router.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    try:
        # Create the main task
        db_task = Task(
            name=task.name,
            description=task.description,
            created_at=datetime.utcnow(),
            status=TaskStatus.pending
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        # Create subtasks if provided
        if task.subtasks:
            for subtask_data in task.subtasks:
                db_subtask = Subtask(
                    title=subtask_data.title,
                    description=subtask_data.description,
                    task_id=db_task.id
                )
                db.add(db_subtask)
            db.commit()
            db.refresh(db_task)
        
        return db_task
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")
```

**Step by Step Explanation:**
1. **Receive request**: Get task data from the frontend
2. **Create task**: Make a new task in the database
3. **Create subtasks**: If subtasks were provided, create them too
4. **Return result**: Send back the created task with all its data
5. **Handle errors**: If something goes wrong, undo changes and show error

### Other Endpoints

#### Get All Tasks
```python
@router.get("/tasks", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()
```
- **What it does**: Returns all tasks in the database
- **Simple explanation**: "Show me everything"

#### Start Task
```python
@router.put("/tasks/{task_id}/start", response_model=TaskResponse)
def start_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = TaskStatus.in_progress
    db_task.started_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task
```
- **What it does**: Changes a task status to "in progress"
- **Simple explanation**: "Mark this task as started and record when it started"

#### Complete Task
```python
@router.put("/tasks/{task_id}/complete", response_model=TaskResponse)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = TaskStatus.completed
    db_task.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task
```
- **What it does**: Changes a task status to "completed"
- **Simple explanation**: "Mark this task as finished and record when it finished"

#### Delete Task
```python
@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}
```
- **What it does**: Removes a task from the database
- **Simple explanation**: "Delete this task and all its subtasks"

#### Analytics Endpoint
```python
@router.get("/tasks/analytics")
def get_task_analytics(db: Session = Depends(get_db)):
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
        
        if task.subtasks:
            analytics["by_subtasks"]["with_subtasks"] += 1
        else:
            analytics["by_subtasks"]["without_subtasks"] += 1
    
    return analytics
```
- **What it does**: Counts tasks by status and subtask presence
- **Simple explanation**: "Give me statistics about how many tasks are in each state and how many have subtasks"

---

## How Everything Works Together

1. **Frontend sends request**: User fills out a form and clicks submit
2. **Router receives request**: The task router gets the data
3. **Data validation**: Pydantic checks if the data is correct
4. **Database operation**: CRUD functions save the data
5. **Response sent back**: The router sends back the result
6. **Frontend updates**: The user sees the new task

## Key Concepts

- **Models**: Define what the database tables look like
- **Schemas**: Define what data should look like when sent/received
- **CRUD**: Functions that actually do database operations
- **Router**: Handles web requests and responses
- **Session**: A conversation with the database
- **Transaction**: A group of database changes that succeed or fail together

This setup ensures that data is properly validated, stored, and retrieved while maintaining data integrity and providing a clean API interface. 
1. Database Setup Folder Structure
Explains what each file in the database_setup/ folder does
Shows the relationship between different components
2. Database Connection (database.py)
Simple explanation: How the app connects to the database
Code breakdown: Each line explained in plain English
Key concepts: Engine, Session, and connection management
3. Database Models (models.py)
Task and Subtask tables: What each field stores
Enums: How task statuses work
Relationships: How tasks and subtasks are linked
Field-by-field explanation: What each column does
4. Data Validation (schemas.py)
Pydantic models: How data is validated
Request/Response formats: What data looks like coming in and going out
Optional vs Required fields: Which fields are mandatory
5. Database Operations (crud.py)
CRUD functions: Create, Read, Update, Delete operations
Error handling: How the app handles database errors
Step-by-step process: How tasks and subtasks are created
6. Task Router (app/routers/task.py)
All endpoints: Create, read, start, complete, delete tasks
Request handling: How the app processes incoming data
Response formatting: How data is sent back to the frontend
Error management: How errors are handled and reported
7. How Everything Works Together
Complete flow: From frontend request to database storage
Data validation: How data is checked at each step
Error handling: How problems are caught and resolved