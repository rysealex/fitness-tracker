import mysql.connector.pooling
from mysql.connector import Error
from config import Config
import time 

_connection_pool = None

def init_db_pool(max_retries=10, retry_delay_seconds=5):
    """
    Initializes the database connection pool with retry logic.
    """
    global _connection_pool
    if _connection_pool is not None: 
        print("Database connection pool already initialized.")
        return

    db_config = {
        'host': Config.DATABASE_HOST,
        'port': Config.DATABASE_PORT,
        'user': Config.DATABASE_USER,
        'password': Config.DATABASE_PASSWORD,
        'database': Config.DATABASE_NAME,
        'pool_name': 'mysql_connection_pool',
        'pool_size': 5,
        'autocommit': False
    }

    for i in range(max_retries):
        try:
            print(f"Attempting to initialize database connection pool (Attempt {i+1}/{max_retries})...")
            _connection_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)
            print("Database connection pool initialized successfully.")
            return
        except Error as e:
            print(f"Connection attempt failed: {e}")
            if i < max_retries - 1:
                print(f"Retrying in {retry_delay_seconds} seconds...")
                time.sleep(retry_delay_seconds)
            else:
                print(f"CRITICAL ERROR: Failed to initialize database connection pool after {max_retries} retries.")
                raise 

def get_db_connection():
    """
    Retrieves a connection from the pool.
    """
    if _connection_pool is None:
        raise RuntimeError("Database connection pool has not been initialized.")

    try:
        return _connection_pool.get_connection()
    except Error as e:
        print(f"Error getting connection from pool: {e}")
        raise 
