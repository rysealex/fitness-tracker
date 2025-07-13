from flask import Blueprint, request, jsonify
from models.goal_model import GoalModel

goal_bp = Blueprint('goal', __name__, url_prefix='/goal')
goal_model = GoalModel()

@goal_bp.route('/entries', methods=['GET'])
def get_all_goals():
    """Endpoint to get all goals"""
    goals = goal_model.get_all_goals()

    if goals is not None:
        return jsonify(goals), 200
    else:
        return jsonify({"error": "Failed to fetch goals"}), 500
    
@goal_bp.route('/add', methods=['POST'])
def add_goal():
    """Endpoint to add a new goal"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    user_id = data.get('user_id')
    goal_title = data.get('goal_title')
    goal_type = data.get('goal_type')
    # start_date = data.get('start_date')
    # end_date = data.get('end_date')
    # status = data.get('status')

    if not all([user_id, goal_title, goal_type]):
        return jsonify({"error": "All fields are required"}), 400

    goal_id = goal_model.add_goal(user_id, goal_title, goal_type)

    if goal_id:
        return jsonify({"message": "Goal added successfully", "goal_id": goal_id}), 201
    else:
        return jsonify({"error": "Failed to add goal"}), 500
    
@goal_bp.route('/edit/<int:goal_id>', methods=['PUT'])
def edit_goal(goal_id):
    """Endpoint to edit a goal"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    goal_title = data.get('goal_title')
    goal_type = data.get('goal_type')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    status = data.get('status')

    if not all([goal_title, goal_type, start_date, end_date, status]):
        return jsonify({"error": "All fields are required"}), 400

    updated_rows = goal_model.edit_goal(goal_id, goal_title, goal_type, start_date, end_date, status)

    if updated_rows is not None:
        return jsonify({"message": "Goal updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update goal"}), 500

@goal_bp.route('/delete/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """Endpoint to delete a goal"""
    deleted_rows = goal_model.delete_goal(goal_id)

    if deleted_rows is not None:
        return jsonify({"message": "Goal deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete goal"}), 500

@goal_bp.route('/entries/<int:user_id>', methods=['GET'])
def get_goals_by_user(user_id):
    """Endpoint to get all goals for a specific user"""
    goals = goal_model.get_goals_by_user_id(user_id)

    if goals is not None:
        return jsonify(goals), 200
    else:
        return jsonify({"error": "Failed to fetch goals for user"}), 500