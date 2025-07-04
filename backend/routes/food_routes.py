from flask import Blueprint, request, jsonify
from models.food_entry_model import FoodEntryModel

food_bp = Blueprint('food', __name__, url_prefix='/food')
food_model = FoodEntryModel()

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

    if not all([user_id, food_name, total_calories, meal_type]):
        return jsonify({"error": "All fields are required"}), 400

    food_entry_id = food_model.add_food_entry(user_id, food_name, total_calories, meal_type)

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

    if not all([food_name, total_calories, meal_type]):
        return jsonify({"error": "All fields are required"}), 400

    updated_rows = food_model.edit_food_entry(food_entries_id, food_name, total_calories, meal_type)

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
    food_entries = food_model.get_food_entries_by_user(user_id)

    if food_entries is not None:
        return jsonify(food_entries), 200
    else:
        return jsonify({"error": "Failed to fetch food entries for user"}), 500