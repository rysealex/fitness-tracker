import os

class Config:
    """Base configuration class."""
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_PORT = int(os.getenv('DATABASE_PORT', 3306))
    DATABASE_USER = os.getenv('DATABASE_USER', 'app_user')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', 'app_password')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'fitness_tracker')

    # Flask-SQLAlchemy configuration
    # This combines the above variables into a single connection string
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    PORT = int(os.getenv('PORT', 5000))

    """User profile pic upload definitions"""
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'public', 'images')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
