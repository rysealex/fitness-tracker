import os

class Config:
    """Base configuration class."""
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_PORT = int(os.getenv('DATABASE_PORT', 3306))
    DATABASE_USER = os.getenv('DATABASE_USER', 'app_user')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', 'app_password')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'fitness_tracker')

    PORT = int(os.getenv('PORT', 5000))

    """User profile pic upload definitions"""
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'public', 'images')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
