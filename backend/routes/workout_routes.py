import os, jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from models.workout_log_model import WorkoutLogModel

workout_bp = Blueprint('workout', __name__, url_prefix='/workout')
workout_model = WorkoutLogModel()

# decorator to protect routes with JWT authentication
def jwt_required(f):
    """
    Decorator to protect API routes, requiring a valid JWT token in the
    'Authorization' header.
    """
    def decorated_function(*args, **kwargs):
        # get the token from Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Authorization header is missing'}), 401

        try:
            # check for the 'Bearer' schema and split the token
            token = auth_header.split(" ")[1]
            # decode the token using the JWT secret from environment variables
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            # pass the user_id from the token payload to the decorated function
            kwargs['user_id'] = payload['user_id']

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except (jwt.InvalidTokenError, IndexError):
            return jsonify({'message': 'Invalid Token'}), 401
        
        return f(*args, **kwargs)

    decorated_function.__name__ = f.__name__
    return decorated_function

@workout_bp.route('/stats', methods=['GET'])
@jwt_required
def get_workout_logs_stats(user_id):
    """
    Endpoint to get workout log statistics.
    The user_id is automatically passed from the JWT token by the decorator.
    """
    workout_logs = workout_model.get_todays_workout_logs_by_user_id(user_id)
    if workout_logs:
        return jsonify(workout_logs), 200
    else:
        return jsonify({"error": "Workout logs not found"}), 404

@workout_bp.route('/entries', methods=['GET'])
def get_all_workout_logs():
    """Endpoint to get all workout logs"""
    workout_logs = workout_model.get_all_workout_logs()

    if workout_logs is not None:
        return jsonify(workout_logs), 200
    else:
        return jsonify({"error": "Failed to fetch workout logs"}), 500

@workout_bp.route('/add', methods=['POST'])
def add_workout_log():
    """Endpoint to add a new workout log"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    user_id = data.get('user_id')
    workout_type = data.get('workout_type')
    calories_burned = data.get('calories_burned')
    duration_min = data.get('duration_min')
    created_at = data.get('created_at')

    if not all([user_id, workout_type, calories_burned, duration_min, created_at]):
        return jsonify({"error": "All fields are required"}), 400

    workout_id = workout_model.add_workout_log(user_id, workout_type, calories_burned, duration_min, created_at)

    if workout_id:
        return jsonify({"message": "Workout log added successfully", "workout_id": workout_id}), 201
    else:
        return jsonify({"error": "Failed to add workout log"}), 500

@workout_bp.route('/edit/<int:workout_id>', methods=['PUT'])
def edit_workout_log(workout_id):
    """Endpoint to edit a workout log"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    workout_type = data.get('workout_type')
    calories_burned = data.get('calories_burned')
    duration_min = data.get('duration_min')
    created_at = data.get('created_at')

    if not all([workout_type, calories_burned, duration_min, created_at]):
        return jsonify({"error": "All fields are required"}), 400

    updated_rows = workout_model.edit_workout_log(workout_id, workout_type, calories_burned, duration_min, created_at)

    if updated_rows is not None:
        return jsonify({"message": "Workout log updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update workout log"}), 500

@workout_bp.route('/delete/<int:workout_id>', methods=['DELETE'])
def delete_workout_log(workout_id):
    """Endpoint to delete a workout_log"""
    deleted_rows = workout_model.delete_workout_log(workout_id)

    if deleted_rows is not None:
        return jsonify({"message": "Workout log deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete workout log"}), 500

@workout_bp.route('/entries/<int:user_id>', methods=['GET'])
def get_workout_logs_by_user(user_id):
    """Endpoint to get all workout logs for a specific user"""
    workout_logs = workout_model.get_workout_logs_by_user_id(user_id)

    if workout_logs is not None:
        return jsonify(workout_logs), 200
    else:
        return jsonify({"error": "Failed to fetch workout logs for user"}), 500
    
@workout_bp.route('/entries/today/<int:user_id>', methods=['GET'])
def get_todays_workout_logs_by_user(user_id):
    """Endpoint to get all of today's workout logs for a specific user"""
    workout_logs = workout_model.get_todays_workout_logs_by_user_id(user_id)

    if workout_logs is not None:
        return jsonify(workout_logs), 200
    else:
        return jsonify({"error": "Failed to fetch today's workout logs for user"}), 500
    
@workout_bp.route('/entries/specific/<int:user_id>/<specified_day>', methods=['GET'])
def get_specified_days_wrokout_logs_by_user(user_id, specified_day):
    """Endpoint to get all of specified day's workout logs for a specific user"""
    workout_logs = workout_model.get_specified_days_workout_logs_by_user_id(user_id, specified_day)

    return jsonify(workout_logs if workout_logs is not None else []), 200