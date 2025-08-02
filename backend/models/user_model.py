import decimal, bcrypt
from datetime import datetime
from mysql.connector import Error
from database import get_db_connection

class UserModel:
    """Function to get all users from the database"""
    def get_all_users(self):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Users
            """

            cursor.execute(sql)
            users = cursor.fetchall()
            return users
        except Error as e:
            print(f"Error fetching users: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to create a user in the database"""
    def create_user(self, username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at=datetime.now()):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Users (username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
            if isinstance(created_at, str):
                created_at = datetime.strptime(created_at, "%Y-%m-%d").date()

            user_data = (username, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at)
            cursor.execute(sql, user_data)
            conn.commit() # Commit the transaction
            return cursor.lastrowid # Return the ID of the newly created user
        except Error as e:
            print(f"Error creating user: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to check if a user exists in the database by username and password"""
    def user_exists(self, username, password):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Users WHERE username = %s
            """
            cursor.execute(sql, (username,))
            user = cursor.fetchone()
            # check if password matches the hashed password in the database
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return user
            return None
        except Error as e:
            print(f"Error checking if user exists: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to get a user by user_id"""
    def get_user_by_id(self, user_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Users WHERE user_id = %s
            """
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            return user
        except Error as e:
            print(f"Error fetching user by ID: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to check if a username already exists in the database"""
    def username_exists(self, username):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Users WHERE username = %s
            """
            cursor.execute(sql, (username,))
            user = cursor.fetchone()
            return user is not None
        except Error as e:
            print(f"Error checking if username exists: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to update user details"""
    def update_user_attribute(self, user_id, attribute, value):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = f"""
            UPDATE Users SET {attribute} = %s WHERE user_id = %s
            """
            cursor.execute(sql, (value, user_id))
            conn.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error updating the user's {attribute} with {value}: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a user by user_id and password"""
    def delete_user(self, user_id, password):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # first, fetch the hashed password for the user from the db
            sql = """
                SELECT password FROM Users WHERE user_id = %s
            """
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            if not user:
                return False
            
            # 2, check if provided password matches the hashed password
            hashed_password = user['password']
            if not bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                return False
            
            # 3, delete the user
            sql = """
            DELETE FROM Users WHERE user_id = %s
            """
            cursor.execute(sql, (user_id,))
            conn.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error deleting user with ID {user_id}: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to update a user profile pic"""
    def update_user_profile_pic(self, user_id, image_url):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE Users SET profile_pic = %s WHERE user_id = %s
            """
            cursor.execute(sql, (image_url, user_id))
            conn.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error updating user {user_id} with image URL of {image_url}: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to update user height and weight"""
    def update_user_height_weight(self, user_id, height_ft, weight_lbs):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            decimal.getcontext().prec = 10 # Set a higher precision for intermediate calculations
            
            height_decimal = decimal.Decimal(str(height_ft)).quantize(decimal.Decimal('0.1'), rounding=decimal.ROUND_HALF_UP)
            weight_decimal = decimal.Decimal(str(weight_lbs)).quantize(decimal.Decimal('0.01'), rounding=decimal.ROUND_HALF_UP)

            sql = """
            UPDATE Users SET height_ft = %s, weight_lbs = %s WHERE user_id = %s
            """
            cursor.execute(sql, (height_decimal, weight_decimal, user_id))
            conn.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error updating user {user_id} with height {height_ft} and weight {weight_lbs}: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()