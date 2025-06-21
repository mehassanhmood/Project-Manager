#!/usr/bin/env python3
"""
Migration script to add started_at and completed_at columns to subtask table
"""

import sqlite3
import os
from datetime import datetime

def migrate_subtask_dates():
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'buraq_manager.db')
    
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if started_at column exists
        cursor.execute("PRAGMA table_info(subtask)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add started_at column if it doesn't exist
        if 'started_at' not in columns:
            cursor.execute("ALTER TABLE subtask ADD COLUMN started_at DATETIME")
            print("✓ Added started_at column")
        else:
            print("✓ started_at column already exists")
        
        # Add completed_at column if it doesn't exist
        if 'completed_at' not in columns:
            cursor.execute("ALTER TABLE subtask ADD COLUMN completed_at DATETIME")
            print("✓ Added completed_at column")
        else:
            print("✓ completed_at column already exists")
        
        # Add created_at column if it doesn't exist
        if 'created_at' not in columns:
            cursor.execute("ALTER TABLE subtask ADD COLUMN created_at DATETIME")
            print("✓ Added created_at column")
        else:
            print("✓ created_at column already exists")
        
        # Update existing subtasks to have created_at if they don't have it
        cursor.execute("UPDATE subtask SET created_at = updated_at WHERE created_at IS NULL")
        print("✓ Updated existing subtasks with created_at values")
        
        conn.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_subtask_dates() 