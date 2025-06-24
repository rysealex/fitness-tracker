import mysql.connector.pooling
from mysql.connector import Error
from config import Config

# Database configuration dictionary
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

try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)
    print("Connection pool created successfully.")
except Error as e:  
    print(f"Error creating connection pool: {e}")
    raise

def get_connection():
    try:
        return connection_pool.get_connection()
    except Error as e:
        print(f"Error getting connection from pool: {e}")
        raise