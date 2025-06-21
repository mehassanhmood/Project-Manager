#!/usr/bin/env python3
"""
Script to verify database schema matches our models
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, inspect, text
from backend.database_setup.database import Base
from backend.database_setup.models import Task, Subtask

def verify_schema():
    """Verify that the database schema matches our models"""
    
    # Create engine (using the same database as your app)
    engine = create_engine("sqlite:///database/tasks.db")
    
    # Create inspector
    inspector = inspect(engine)
    
    print("🔍 Verifying Database Schema...")
    print("=" * 50)
    
    # Check if tables exist
    tables = inspector.get_table_names()
    print(f"📋 Found tables: {tables}")
    
    # Verify Task table
    if 'task' in tables:
        print("\n✅ Task table exists")
        task_columns = inspector.get_columns('task')
        task_column_names = [col['name'] for col in task_columns]
        print(f"   Columns: {task_column_names}")
        
        # Check required columns
        required_task_columns = ['id', 'page_name', 'name', 'description', 'status', 'created_at', 'started_at', 'completed_at']
        missing_task_columns = [col for col in required_task_columns if col not in task_column_names]
        if missing_task_columns:
            print(f"   ❌ Missing columns: {missing_task_columns}")
        else:
            print("   ✅ All required task columns present")
    else:
        print("❌ Task table missing!")
    
    # Verify Subtask table
    if 'subtask' in tables:
        print("\n✅ Subtask table exists")
        subtask_columns = inspector.get_columns('subtask')
        subtask_column_names = [col['name'] for col in subtask_columns]
        print(f"   Columns: {subtask_column_names}")
        
        # Check required columns for enhanced subtask management
        required_subtask_columns = ['id', 'task_id', 'title', 'description', 'status', 'created_at', 'updated_at']
        missing_subtask_columns = [col for col in required_subtask_columns if col not in subtask_column_names]
        if missing_subtask_columns:
            print(f"   ❌ Missing columns: {missing_subtask_columns}")
        else:
            print("   ✅ All required subtask columns present")
    else:
        print("❌ Subtask table missing!")
    
    # Check foreign key constraints
    print("\n🔗 Checking foreign key constraints...")
    fks = inspector.get_foreign_keys('subtask')
    if fks:
        for fk in fks:
            if fk['constrained_columns'] == ['task_id'] and fk['referred_table'] == 'task':
                print("   ✅ Foreign key constraint: subtask.task_id -> task.id")
            else:
                print(f"   ⚠️  Unexpected foreign key: {fk}")
    else:
        print("   ❌ No foreign key constraints found on subtask table")
    
    # Check indexes
    print("\n📊 Checking indexes...")
    task_indexes = inspector.get_indexes('task')
    subtask_indexes = inspector.get_indexes('subtask')
    
    print(f"   Task indexes: {[idx['name'] for idx in task_indexes]}")
    print(f"   Subtask indexes: {[idx['name'] for idx in subtask_indexes]}")
    
    # Test creating tables from models
    print("\n🧪 Testing model creation...")
    try:
        # This will create tables if they don't exist
        Base.metadata.create_all(engine)
        print("   ✅ Models can create tables successfully")
    except Exception as e:
        print(f"   ❌ Error creating tables from models: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Schema verification complete!")

if __name__ == "__main__":
    verify_schema() 