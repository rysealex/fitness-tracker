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
    email = data.get('email')
    password = data.get('password')
    fname = data.get('fname')
    lname = data.get('lname')
    dob = data.get('dob')
    height_ft = data.get('height_ft')
    weight_lbs = data.get('weight_lbs')
    gender = data.get('gender')
    profile_pic = data.get('profile_pic')
    occupation = data.get('occupation')

    if not all([username, email, password, fname, lname, dob, height_in, weight_lbs, gender, profile_pic, occupation]):
        return jsonify({"error": "All fields are required"}), 400

    user_id = user_model.create_user(username, email, password, fname, lname, dob, height_in, weight_lbs, gender, profile_pic, occupation)

    if user_id:
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    else:
        return jsonify({"error": "User registration failed"}), 500