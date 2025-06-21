import sqlite3
import os

def add_started_at_column():
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
        
        if 'started_at' not in columns:
            cursor.execute("ALTER TABLE subtask ADD COLUMN started_at DATETIME")
            print("✓ Added started_at column")
        else:
            print("✓ started_at column already exists")
        
        conn.commit()
        print("Column addition completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_started_at_column() 