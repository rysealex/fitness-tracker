from flask import Blueprint, request, jsonify
from models.user_model import UserModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
user_model = UserModel()

@auth_bp.route('/users', methods=['GET'])
def get_all_users():
    """Endpoint to get all users"""
    users = user_model.get_all_users()
    
    if users is not None:
        return jsonify(users), 200
    else:
        return jsonify({"error": "Failed to fetch users"}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint to register a new user"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    username = data.get('username')
    password = data.get('password')
    fname = data.get('fname')
    lname = data.get('lname')
    dob = data.get('dob')
    height_ft = data.get('height_ft')
    weight_lbs = data.get('weight_lbs')
    gender = data.get('gender')
    profile_pic = data.get('profile_pic')
    occupation = data.get('occupation')
    created_at = data.get('created_at')

    if not all([username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at]):
        return jsonify({"error": "All fields are required"}), 400

    user_id = user_model.create_user(username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at)

    if user_id:
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    else:
        return jsonify({"error": "User registration failed"}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint to log in a user"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({"error": "Username and password are required"}), 400

    user = user_model.user_exists(username, password)

    if user:
        return jsonify({"message": "Login successful", "user": user}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    
@auth_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    """Endpoint to get a user by user_id"""
    user = user_model.get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
@auth_bp.route('/username-exists', methods=['POST'])
def username_exists():
    """Endpoint to check if a username exists"""
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    exists = user_model.username_exists(username)
    return jsonify({"exists": exists}), 200