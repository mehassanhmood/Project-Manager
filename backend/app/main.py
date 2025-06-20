from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database_setup.database import engine
from database_setup.models import Base, Task, Subtask  # Import models to register them
from app.routers import task

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the task router
app.include_router(task.router, prefix="/api/v1")
