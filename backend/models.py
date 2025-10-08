from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum

db = SQLAlchemy()

# Define the User model, corresponding to the `Users` table
class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fname = db.Column(db.String(35), nullable=False)
    lname = db.Column(db.String(35), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    height_ft = db.Column(db.DECIMAL(3, 2), nullable=False)
    weight_lbs = db.Column(db.DECIMAL(6, 2), nullable=False)
    gender = db.Column(Enum("Male", "Female", "Other"), nullable=False)
    profile_pic = db.Column(db.String(255), nullable=True)
    occupation = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Establish relationships with other tables for easy access
    food_entries = db.relationship('FoodEntry', backref='user', lazy=True)
    workout_logs = db.relationship('WorkoutLog', backref='user', lazy=True)
    goals = db.relationship('Goal', backref='user', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.fname} {self.lname}')"

# Define the FoodEntry model, corresponding to the `Food_Entries` table
class FoodEntry(db.Model):
    __tablename__ = 'Food_Entries'

    food_entries_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    food_name = db.Column(db.String(255), nullable=False)
    total_calories = db.Column(db.Integer, nullable=False)
    meal_type = db.Column(Enum("Breakfast", "Lunch", "Dinner", "Snack"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"FoodEntry('{self.food_name}', '{self.meal_type}')"

# Define the WorkoutLog model, corresponding to the `Workout_Logs` table
class WorkoutLog(db.Model):
    __tablename__ = 'Workout_Logs'

    workout_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    workout_type = db.Column(Enum("Running", "Swimming", "Biking", "Walking", "Strength", "Yoga", "Other"), nullable=False)
    calories_burned = db.Column(db.Integer, nullable=False)
    duration_min = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"WorkoutLog('{self.workout_type}', '{self.duration_min} min')"

# Define the Goal model, corresponding to the `Goals` table
class Goal(db.Model):
    __tablename__ = 'Goals'

    goal_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    goal_title = db.Column(db.String(255), nullable=False)
    goal_type = db.Column(Enum("Weight Loss", "Strength Gain", "Cardio Endurance", "Flexibility", "Nutrition", "Overall Health", "Other"), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(Enum("Active", "Completed", "Abandoned"), nullable=False)
    
    def __repr__(self):
        return f"Goal('{self.goal_title}', '{self.status}')"
