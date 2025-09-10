import os, jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from models.goal_model import GoalModel

goal_bp = Blueprint('goal', __name__, url_prefix='/goal')
goal_model = GoalModel()

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

@goal_bp.route('/stats', methods=['GET'])
@jwt_required
def get_goal_entry_stats(user_id):
    """
    Endpoint to get goal entry statistics.
    The user_id is automatically passed from the JWT token by the decorator.
    """
    try:
        goals = goal_model.get_goals_by_user_id(user_id)
        # always return a list, even if there are currnetly no goals
        return jsonify(goals), 200
    # only give error if there is an actual exception
    except Exception as e:
        return jsonify({"error": "An internal server error occured."}), 500

@goal_bp.route('/entries', methods=['GET'])
def get_all_goals():
    """Endpoint to get all goals"""
    goals = goal_model.get_all_goals()

    if goals is not None:
        return jsonify(goals), 200
    else:
        return jsonify({"error": "Failed to fetch goals"}), 500
    
@goal_bp.route('/add', methods=['POST'])
@jwt_required
def add_goal(user_id):
    """Endpoint to add a new goal"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # user_id = data.get('user_id')
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
    status = data.get('status')

    if not all([goal_title, goal_type, status]):
        return jsonify({"error": "All fields are required"}), 400

    # determine the end date based off of status
    if status == "Active":
        end_date = None
    elif status == "Completed" or status == "Abandoned":
        end_date = datetime.now()
    else:
        return jsonify({"error": "Failed to update goal because status failed"}), 500

    updated_rows = goal_model.edit_goal(goal_id, goal_title, goal_type, end_date, status)

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

@goal_bp.route('/entriesbyuser', methods=['GET'])
@jwt_required
def get_goals_by_user(user_id):
    """Endpoint to get all goals for a specific user"""
    goals = goal_model.get_goals_by_user_id(user_id)

    if goals is not None:
        return jsonify(goals), 200
    else:
        return jsonify({"error": "Failed to fetch goals for user"}), 500