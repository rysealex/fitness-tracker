from flask import Blueprint, request, jsonify
from models.workout_log_model import WorkoutLogModel

workout_bp = Blueprint('workout', __name__, url_prefix='/workout')
workout_model = WorkoutLogModel()

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

    if not all([user_id, workout_type, calories_burned, duration_min]):
        return jsonify({"error": "All fields are required"}), 400

    workout_id = workout_model.add_workout_log(user_id, workout_type, calories_burned, duration_min)

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

    if not all([workout_type, calories_burned, duration_min]):
        return jsonify({"error": "All fields are required"}), 400

    updated_rows = workout_model.edit_workout_log(workout_id, workout_type, calories_burned, duration_min)

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