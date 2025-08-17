import os, bcrypt, jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from models.user_model import UserModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
user_model = UserModel()

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

@auth_bp.route('/stats', methods=['GET'])
@jwt_required
def get_user_stats(user_id):
    """
    Endpoint to get user statistics.
    The user_id is automatically passed from the JWT token by the decorator.
    """
    user = user_model.get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404

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

    if not all([username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation]):
        return jsonify({"error": "All fields are required"}), 400
    
    # hash the password before storing in db
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user_id = user_model.create_user(username, hashed_password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation)

    if user_id:
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    else:
        return jsonify({"error": "User registration failed"}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint to log in a user and return a JWT token"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({"error": "Username and password are required"}), 400

    user = user_model.user_exists(username, password)

    if user:
        # return jsonify({"message": "Login successful", "user": user}), 200
        try:
            # create a JWT payload
            payload = {
                'user_id': user.get('user_id'),
                'exp': datetime.utcnow() + timedelta(hours=24) # expires after 24 hours
            }
            # encode the JWT token and return to the client
            token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
            return jsonify({"message": "Login successful", "token": token}), 200
        except Exception as e:
            current_app.logger.error(f"Error creating JWT token: {e}")
            return jsonify({"error": "Failed to generate token"}), 500
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

@auth_bp.route('/update-attribute/<int:user_id>', methods=['PUT'])
def update_user_attribute(user_id):
    """Endpoint to update a user's attribute"""
    data = request.get_json()
    attribute = data.get('attribute')
    value = data.get('value')

    if not attribute or value is None:
        return jsonify({"error": "Attribute and value are required"}), 400

    updated = user_model.update_user_attribute(user_id, attribute, value)

    if updated:
        return jsonify({"message": "User attribute updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update user attribute"}), 500

@auth_bp.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Endpoint to delete a user by user_id and password"""
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    deleted = user_model.delete_user(user_id, password)

    if deleted:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete user"}), 500
    
# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@auth_bp.route('/upload-profile-pic', methods=['POST'])
def upload_profile_pic():
    """Endpoint to upload a user profile pic"""
    if 'profile_pic' not in request.files:
        current_app.logger.warning("No 'profile_pic' file part in request.")
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['profile_pic']

    if file.filename == '':
        current_app.logger.warning("No selected file (empty filename).")
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # generate a secure and unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{os.urandom(8).hex()}_{filename}"

        try:
            # construct the full path where the file will be saved
            upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(upload_path)
            current_app.logger.info(f"File saved to: {upload_path}")

            # construct the URL to access the image
            image_url = f"{request.url_root}images/{unique_filename}"
            current_app.logger.info(f"Generated image URL: {image_url}")

            return jsonify({
                "message": "File uploaded successfully!",
                "imageUrl": image_url
            }), 200
        
        except Exception as e:
            current_app.logger.error(f"Error saving file: {e}", exc_info=True)
            return jsonify({"message": f"Error uploading file: {str(e)}"}), 500
    else:
        current_app.logger.warning(f"File type not allowed for: {file.filename}")
        return jsonify({"message": "File type not allowed"}), 400

@auth_bp.route('/user/<string:user_id>/update-profile-pic', methods=['PUT'])
def update_profile_pic(user_id):
    """Endpoint to update a user profile pic"""
    if 'profile_pic' not in request.files:
        current_app.logger.warning("No 'profile_pic' file part in request.")
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['profile_pic']

    if file.filename == '':
        current_app.logger.warning("No selected file (empty filename).")
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # generate a secure and unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{os.urandom(8).hex()}_{filename}"

        try:
            # construct the full path where the file will be saved
            upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(upload_path)
            current_app.logger.info(f"File saved to: {upload_path}")

            # construct the URL to access the image
            image_url = f"{request.url_root}images/{unique_filename}"
            current_app.logger.info(f"Generated image URL: {image_url}")

            # update the user profile pic in the db
            success = user_model.update_user_profile_pic(user_id, image_url)

            if success:
                current_app.logger.info(f"Database updated with new profile pic URL: {image_url} for user {user_id}.")
                return jsonify({
                    "message": "Profile picture updated successfully!",
                    "imageUrl": image_url # return the new URL to the frontend
                }), 200
            else:
                # delete the saved file if db failed
                os.remove(upload_path)
                current_app.logger.error(f"Failed to update database for user {user_id}. Deleting uploaded file.")
                return jsonify({"message": "Failed to update profile picture in database."}), 500

        except Exception as e:
            current_app.logger.error(f"Error processing profile pic update for user {user_id}: {e}", exc_info=True)
            return jsonify({"message": f"Error uploading file: {str(e)}"}), 500
    else:
        current_app.logger.warning(f"File type not allowed for user {user_id}: {file.filename}")
        return jsonify({"message": "File type not allowed"}), 400
    
@auth_bp.route('/user/<int:user_id>/update-height-weight', methods=['PUT'])
def update_height_weight(user_id):
    """Endpoint to update user height and weight"""
    data = request.get_json()
    height_ft = data.get('height_ft')
    weight_lbs = data.get('weight_lbs')

    if height_ft is None or weight_lbs is None:
        return jsonify({"error": "Height and weight are required"}), 400

    updated = user_model.update_user_height_weight(user_id, height_ft, weight_lbs)

    if updated:
        return jsonify({"message": "User height and weight updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update user height and weight"}), 500