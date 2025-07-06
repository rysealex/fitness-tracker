from datetime import datetime
from mysql.connector import Error
from database import get_db_connection

class WorkoutLogModel:
    """Function to get all workout logs from the database"""
    def get_all_workout_logs(self):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Workout_Logs
            """

            cursor.execute(sql)
            workout_logs = cursor.fetchall()
            return workout_logs
        except Error as e:
            print(f"Error fetching workout logs: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to add a workout log to the database"""
    def add_workout_log(self, user_id, workout_type, calories_burned, duration_min, created_at=datetime.now()):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO Workout_Logs (user_id, workout_type, calories_burned, duration_min, created_at)
            VALUES (%s, %s, %s, %s, %s)
            """

            if isinstance(created_at, str):
                created_at = datetime.strptime(created_at, "%Y-%m-%d").date()

            cursor.execute(sql, (user_id, workout_type, calories_burned, duration_min, created_at))
            conn.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error adding workout log: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to edit a workout log in the database"""
    def edit_workout_log(self, workout_id, workout_type, calories_burned, duration_min, created_at=datetime.now()):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE Workout_Logs
            SET workout_type = %s, calories_burned = %s, duration_min = %s, created_at = %s
            WHERE workout_id = %s
            """

            if isinstance(created_at, str):
                created_at = datetime.strptime(created_at, "%Y-%m-%d").date()

            cursor.execute(sql, (workout_type, calories_burned, duration_min, created_at, workout_id))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error editing workout log: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a workout log from the database"""
    def delete_workout_log(self, workout_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            DELETE FROM Workout_Logs WHERE workout_id = %s
            """

            cursor.execute(sql, (workout_id,))
            conn.commit()
            return cursor.rowcount
        except Error as e:
            print(f"Error deleting workout log: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to get all workout logs for a user by user_id"""
    def get_workout_logs_by_user_id(self, user_id):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM Workout_Logs WHERE user_id = %s
            """

            cursor.execute(sql, (user_id,))
            workout_logs = cursor.fetchall()
            return workout_logs
        except Error as e:
            print(f"Error fetching workout logs for user {user_id}: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()