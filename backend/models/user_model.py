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
    def create_user(self, username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at=None):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Users (username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()

            user_data = (username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation, created_at)
            cursor.execute(sql, user_data)
            conn.commit() # Commit the transaction
            return cursor.lastrowid
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
            SELECT * FROM Users WHERE username = %s AND password = %s
            """
            cursor.execute(sql, (username, password))
            user = cursor.fetchone()
            return user
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