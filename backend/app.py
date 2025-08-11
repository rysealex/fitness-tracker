# Docker Container Connection

# import os
# from flask import Flask, jsonify, send_from_directory
# from config import Config
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from routes.auth_routes import auth_bp
# from routes.food_routes import food_bp
# from routes.workout_routes import workout_bp
# from routes.goal_routes import goal_bp
# # import database

# # initialize SQLAlchemy
# db = SQLAlchemy()

# # initialize Flask-Migrate
# migrate = Migrate()

# app = Flask(__name__)
# app.config.from_object(Config)

# # Ensure the upload directory exists when the app starts
# if not os.path.exists(app.config['UPLOAD_FOLDER']):
#     os.makedirs(app.config['UPLOAD_FOLDER'])
#     print(f"Created upload directory: {app.config['UPLOAD_FOLDER']}")

# # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# # database.init_db_pool()

# # initialize the app with the db and migrate objects
# db.init_app(app)
# migrate.init_app(app, db)

# # Register all the blueprints
# app.register_blueprint(auth_bp)
# app.register_blueprint(food_bp)
# app.register_blueprint(workout_bp)
# app.register_blueprint(goal_bp)

# # Route to serve uploaded profile pictures
# @app.route('/images/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/')
# def home():
#     return jsonify({"message": "Welcome to the Fitness Tracker Backend!"})

# AWS RDS Connection
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import init_db
from routes.auth_routes import auth_bp
from routes.food_routes import food_bp
from routes.workout_routes import workout_bp
from routes.goal_routes import goal_bp

# Load environment variables from .env file
load_dotenv()

# Define the create_app function to initialize the application
def create_app():
    """
    Creates and configures the Flask application.
    """
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    print("Initializing database connection pool...")
    init_db()
    print("Database connection pool initialized.")

    # Register the blueprints for all routes
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(food_bp, url_prefix='/food')
    app.register_blueprint(workout_bp, url_prefix='/workout')
    app.register_blueprint(goal_bp, url_prefix='/goal')

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Fitness Tracker API"})

    return app

# Gunicorn needs a top-level `app` variable to run.
app = create_app()

# If this script is run directly, create and run the app
if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)