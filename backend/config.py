import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class."""
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_PORT = int(os.getenv('DATABASE_PORT', 3306))
    DATABASE_USER = os.getenv('DATABASE_USER', 'app_user')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', 'app_password')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'fitness_tracker_db')

    PORT = int(os.getenv('PORT', 5000))