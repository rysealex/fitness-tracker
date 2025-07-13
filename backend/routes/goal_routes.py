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