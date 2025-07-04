from datetime import datetime
from mysql.connector import Error
from database import get_db_connection

class FoodEntryModel:
    """Function to get all food entries from the database"""
    def get_all_food_entries(self):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Food_Entries
            """

            cursor.execute(sql)
            food_entries = cursor.fetchall()
            return food_entries
        except Error as e:
            print(f"Error fetching food entries: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to add a food entry to the database"""
    def add_food_entry(self, user_id, food_name, total_calories, meal_type, created_at=datetime.now()):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Food_Entries (user_id, food_name, total_calories, meal_type, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """

            if isinstance(created_at, str):
                created_at = datetime.strptime(created_at, "%Y-%m-%d").date()

            cursor.execute(sql, (user_id, food_name, total_calories, meal_type, created_at))
            conn.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error adding food entry: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to edit a food entry in the database"""
    def edit_food_entry(self, food_entries_id, food_name, total_calories, meal_type, created_at=datetime.now()):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE Food_Entries
            SET food_name = %s, total_calories = %s, meal_type = %s, created_at = %s
            WHERE food_entries_id = %s
            """

            if isinstance(created_at, str):
                created_at = datetime.strptime(created_at, "%Y-%m-%d").date()

            cursor.execute(sql, (food_name, total_calories, meal_type, created_at, food_entries_id))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error editing food entry: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a food entry from the database"""
    def delete_food_entry(self, food_entries_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            DELETE FROM Food_Entries WHERE food_entries_id = %s
            """

            cursor.execute(sql, (food_entries_id,))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error deleting food entry: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to get all food entries for a user by user_id"""
    def get_food_entries_by_user_id(self, user_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Food_Entries WHERE user_id = %s
            """

            cursor.execute(sql, (user_id,))
            food_entries = cursor.fetchall()
            return food_entries
        except Error as e:
            print(f"Error fetching food entries for user {user_id}: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()