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

    """Function to add a goal to the database"""
    def add_goal(self, user_id, goal_title, goal_type, start_date=datetime.now(), end_date=None, status="Active"):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Goals (user_id, goal_title, goal_type, start_date, end_date, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """

            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

            cursor.execute(sql, (user_id, goal_title, goal_type, start_date, end_date, status))
            conn.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error adding goal: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to edit a goal in the database"""
    def edit_goal(self, goal_id, goal_title, goal_type, start_date, end_date, status):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE Goals
            SET goal_title = %s, goal_type = %s, start_date = %s, end_date = %s, status = %s
            WHERE goal_id = %s
            """

            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

            cursor.execute(sql, (goal_title, goal_type, start_date, end_date, status, goal_id))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error editing goal: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a goal from the database"""
    def delete_goal(self, goal_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            DELETE FROM Goal WHERE goal_id = %s
            """

            cursor.execute(sql, (goal_id,))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error deleting goal: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to get all goals for a user by user_id"""
    def get_goals_by_user_id(self, user_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Goals WHERE user_id = %s
            """

            cursor.execute(sql, (user_id,))
            goals = cursor.fetchall()
            return goals
        except Error as e:
            print(f"Error fetching goals for user {user_id}: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()