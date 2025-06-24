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
    def create_user(self, username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Users (username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            if isinstance(dob, str):
                dob = datetime.strptime(dob, "%Y-%m-%d").date()

            user_data = (username, email, password, fname, lname, dob, height_ft, weight_lbs, gender, profile_pic, occupation)
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