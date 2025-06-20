"""
Base:
    This file makes a base class for all models.
    It registers subclasses (models) so SQLAlchemy knows how to map them to tables.
    Adds ORM functionality to models (like .query, relationships, and more).
Session:
    Makes a session instance from this configured class whenever you need to talk to the DB.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

DB_DIR = "./database"
os.makedirs(DB_DIR, exist_ok=True)  # Ensure the directory exists!
DATABASE_URL = f"sqlite:///{os.path.join(DB_DIR, 'buraq_manager.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()