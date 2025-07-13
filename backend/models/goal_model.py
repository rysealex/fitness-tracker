from datetime import datetime
from mysql.connector import Error
from database import get_db_connection

class GoalModel:
    """Function to get all goals from the database"""
    def get_all_goals(self):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Goals
            """

            cursor.execute(sql)
            goals = cursor.fetchall()
            return goals
        except Error as e:
            print(f"Error fetching goals: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
