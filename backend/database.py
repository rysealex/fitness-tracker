# Docker Container Connection

# import mysql.connector.pooling
# from mysql.connector import Error
# from config import Config
# import time 

# _connection_pool = None

# def init_db_pool(max_retries=10, retry_delay_seconds=5):
#     """
#     Initializes the database connection pool with retry logic.
#     """
#     global _connection_pool
#     if _connection_pool is not None: 
#         print("Database connection pool already initialized.")
#         return

#     db_config = {
#         'host': Config.DATABASE_HOST,
#         'port': Config.DATABASE_PORT,
#         'user': Config.DATABASE_USER,
#         'password': Config.DATABASE_PASSWORD,
#         'database': Config.DATABASE_NAME,
#         'pool_name': 'mysql_connection_pool',
#         'pool_size': 5,
#         'autocommit': False
#     }

#     for i in range(max_retries):
#         try:
#             print(f"Attempting to initialize database connection pool (Attempt {i+1}/{max_retries})...")
#             _connection_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)
#             print("Database connection pool initialized successfully.")
#             return
#         except Error as e:
#             print(f"Connection attempt failed: {e}")
#             if i < max_retries - 1:
#                 print(f"Retrying in {retry_delay_seconds} seconds...")
#                 time.sleep(retry_delay_seconds)
#             else:
#                 print(f"CRITICAL ERROR: Failed to initialize database connection pool after {max_retries} retries.")
#                 raise 

# def get_db_connection():
#     """
#     Retrieves a connection from the pool.
#     """
#     if _connection_pool is None:
#         raise RuntimeError("Database connection pool has not been initialized.")

#     try:
#         return _connection_pool.get_connection()
#     except Error as e:
#         print(f"Error getting connection from pool: {e}")
#         raise 

# AWS RDS Connection
import os
import mysql.connector.pooling # Use mysql.connector for MySQL
from dotenv import load_dotenv

db_pool = None

def init_db():
    """
    Initializes the database connection pool using environment variables.
    """
    global db_pool
    if db_pool is None:
        try:
            # Load environment variables
            load_dotenv()
            
            # Retrieve connection details from environment variables
            db_user = os.getenv("DATABASE_USER")
            db_password = os.getenv("DATABASE_PASSWORD")
            db_host = os.getenv("DATABASE_HOST")
            db_port = os.getenv("DATABASE_PORT", 3306)
            db_name = os.getenv("DATABASE_NAME")

            # Create a simple connection pool with a minimum of 1 and maximum of 10 connections.
            db_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="db_pool",
                                                                  pool_size=10,
                                                                  pool_reset_session=True,
                                                                  host=db_host,
                                                                  port=db_port,
                                                                  database=db_name,
                                                                  user=db_user,
                                                                  password=db_password)
            
            print("Database connection pool successfully created.")
        except Exception as error:
            print(f"Error while connecting to MySQL: {error}")
            db_pool = None # Ensure pool is None if an error occurs

def get_db_connection():
    """
    Gets a connection from the connection pool.
    """
    if db_pool:
        return db_pool.get_connection()
    else:
        raise RuntimeError("Database connection pool has not been initialized.")

def put_db_connection(conn):
    """
    Returns a connection to the pool.
    """
    if db_pool and conn:
        conn.close()
    else:
        print("Warning: Could not return connection to pool.")