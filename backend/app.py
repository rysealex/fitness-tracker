import os
from flask import Flask, jsonify, send_from_directory
from config import Config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from routes.auth_routes import auth_bp
from routes.food_routes import food_bp
from routes.workout_routes import workout_bp
from routes.goal_routes import goal_bp
import database

app = Flask(__name__)
app.config.from_object(Config)

# Ensure the upload directory exists when the app starts
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
    print(f"Created upload directory: {app.config['UPLOAD_FOLDER']}")

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
database.init_db_pool()

# Register all the blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(food_bp)
app.register_blueprint(workout_bp)
app.register_blueprint(goal_bp)

# Route to serve uploaded profile pictures
@app.route('/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Fitness Tracker Backend!"})