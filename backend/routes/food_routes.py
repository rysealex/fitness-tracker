import os, jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from models.food_entry_model import FoodEntryModel

food_bp = Blueprint('food', __name__, url_prefix='/food')
food_model = FoodEntryModel()

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

@food_bp.route('/stats', methods=['GET'])
@jwt_required
def get_food_entry_stats(user_id):
    """
    Endpoint to get food entry statistics.
    The user_id is automatically passed from the JWT token by the decorator.
    """
    food = food_model.get_todays_food_entries_by_user_id(user_id)
    if food:
        return jsonify(food), 200
    else:
        return jsonify({"error": "Food entry not found"}), 404

@food_bp.route('/entries', methods=['GET'])
def get_all_food_entries():
    """Endpoint to get all food entries"""
    food_entries = food_model.get_all_food_entries()

    if food_entries is not None:
        return jsonify(food_entries), 200
    else:
        return jsonify({"error": "Failed to fetch food entries"}), 500

@food_bp.route('/add', methods=['POST'])
def add_food_entry():
    """Endpoint to add a new food entry"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    user_id = data.get('user_id')
    food_name = data.get('food_name')
    total_calories = data.get('total_calories')
    meal_type = data.get('meal_type')
    created_at = data.get('created_at')

    if not all([user_id, food_name, total_calories, meal_type, created_at]):
        return jsonify({"error": "All fields are required"}), 400

    food_entry_id = food_model.add_food_entry(user_id, food_name, total_calories, meal_type, created_at)

    if food_entry_id:
        return jsonify({"message": "Food entry added successfully", "food_entry_id": food_entry_id}), 201
    else:
        return jsonify({"error": "Failed to add food entry"}), 500

@food_bp.route('/edit/<int:food_entries_id>', methods=['PUT'])
def edit_food_entry(food_entries_id):
    """Endpoint to edit a food entry"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    food_name = data.get('food_name')
    total_calories = data.get('total_calories')
    meal_type = data.get('meal_type')
    created_at = data.get('created_at')

    if not all([food_name, total_calories, meal_type, created_at]):
        return jsonify({"error": "All fields are required"}), 400

    updated_rows = food_model.edit_food_entry(food_entries_id, food_name, total_calories, meal_type, created_at)

    if updated_rows is not None:
        return jsonify({"message": "Food entry updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update food entry"}), 500

@food_bp.route('/delete/<int:food_entries_id>', methods=['DELETE'])
def delete_food_entry(food_entries_id):
    """Endpoint to delete a food entry"""
    deleted_rows = food_model.delete_food_entry(food_entries_id)

    if deleted_rows is not None:
        return jsonify({"message": "Food entry deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete food entry"}), 500

@food_bp.route('/entries/<int:user_id>', methods=['GET'])
def get_food_entries_by_user(user_id):
    """Endpoint to get all food entries for a specific user"""
    food_entries = food_model.get_food_entries_by_user_id(user_id)

    if food_entries is not None:
        return jsonify(food_entries), 200
    else:
        return jsonify({"error": "Failed to fetch food entries for user"}), 500
    
@food_bp.route('/entries/today', methods=['GET'])
@jwt_required
def get_todays_food_entries_by_user(user_id):
    """Endpoint to get all of today's food entries for a specific user"""
    food_entries = food_model.get_todays_food_entries_by_user_id(user_id)

    if food_entries is not None:
        return jsonify(food_entries), 200
    else:
        return jsonify({"error": "Failed to fetch today's food entries for user"}), 500
    
@food_bp.route('/entries/specific/<specified_day>', methods=['GET'])
@jwt_required
def get_specified_days_food_entries_by_user(user_id, specified_day):
    """Endpoint to get all of specified day's food entries for a specific user"""
    food_entries = food_model.get_specified_days_food_entries_by_user_id(user_id, specified_day)

    return jsonify(food_entries if food_entries is not None else []), 200