from database_setup.database import engine
import sqlalchemy as sa

def check_subtask_schema():
    with engine.connect() as conn:
        result = conn.execute(sa.text('PRAGMA table_info(subtask)'))
        print('Subtask table columns:')
        for row in result:
            print(f'{row[0]}: {row[1]} ({row[2]}) - Not Null: {row[3]} - Default: {row[4]} - Primary Key: {row[5]}')

if __name__ == "__main__":
    check_subtask_schema() 