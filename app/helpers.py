from flask import render_template, redirect, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from datetime import datetime
import sqlite3


# Decorated function to ensure login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


# Functions to validate username and password
def is_valid_password(password):
    if " " in password or len(password) < 10:
        return False
    
    else:
        return True
    

def is_valid_username(username):
    if len(username) < 6 or len(username) > 25:
        return False
    
    else:
        return True


# Function to render html in case of errors
def render_error(message, status_code):
    return render_template("error.html", message=message, status_code=status_code)


# Database related functions
def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect("../db/learning.db")

    return db


def register_user(username, password):
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT username FROM users WHERE username = ?", (username,))
        existing_username = cursor.fetchone()

        if existing_username:
            return None  # Username already exists

        password_hash = generate_password_hash(password)

        cursor.execute("INSERT INTO users (username, hash) VALUES(?, ?)", (username, password_hash))
        cursor.execute("SELECT user_id FROM users WHERE username = ?", (username,))
        user_id = cursor.fetchone()[0]

        cursor.execute("INSERT INTO preferences (user_id) VALUES(?)", (user_id,))
        cursor.execute("INSERT INTO user_data (user_id) VALUES(?)", (user_id,))

        db.commit()
        return user_id


def authenticate_user(username, password):
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user_data = cursor.fetchone()

        if not user_data:
            return None

        if not check_password_hash(user_data[2], password):
            return None

        return user_data[0]  # Return user_id


def get_flashcards(user_id):
    user_flashcards = []

    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("SELECT flashcard_id, topic, question, answer, timestamp FROM flashcards WHERE user_id = ?",
                   (user_id,))
        
        rows = cursor.fetchall()

        for row in rows:
            timestamp_str = row[4]
            timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

            flashcards_dict = {
                "flashcard_id": row[0],
                "topic": row[1],
                "question": row[2],
                "answer" : row[3],
                "timestamp": timestamp.strftime("%d/%m/%Y")
            }
            
            user_flashcards.append(flashcards_dict)

    return user_flashcards


def get_date_difference(date):
    date_object = datetime.strptime(date, "%d/%m/%Y")
    current_date = datetime.now()
    
    date_difference = current_date - date_object
    days_difference = date_difference.days

    return days_difference


# Function to check whether an element is valid to insert into preferences
def is_valid_element(element):
    try:
        num = int(element)
        return num > 0

    except ValueError:
        return False


def increment_pomodoros(user_id):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("UPDATE user_data SET pomodoros_finished = pomodoros_finished + 1 WHERE user_id = ?", 
                        (user_id,))
        db.commit()


def update_preferences(user_id, **kwargs):
    with get_db() as db:
        cursor = db.cursor()
        # handling minutes
        if "minutes" in kwargs and is_valid_element(kwargs["minutes"]):
            cursor.execute("UPDATE preferences SET minutes = ? WHERE user_id = ?", (kwargs["minutes"], user_id))

        # Handling break
        if "timer_break" in kwargs and is_valid_element(kwargs["timer_break"]):
            cursor.execute("UPDATE preferences SET break = ? WHERE user_id = ?", (kwargs["timer_break"], user_id))

        # Handling long break
        if "long_break" in kwargs and is_valid_element(kwargs["long_break"]):
            cursor.execute("UPDATE preferences SET long_break = ? WHERE user_id = ?", (kwargs["long_break"], user_id))

        db.commit()


def create_flashcard(user_id, topic, question, answer):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("INSERT INTO flashcards (user_id, topic, question, answer) VALUES(?, ?, ?, ?)",
                       (user_id, topic, question, answer))

        db.commit()


def get_specific_flashcard(user_id, topic, question, answer):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("SELECT * FROM flashcards WHERE user_id = ? AND topic = ? AND question = ? AND answer = ?",
                       (user_id, topic, question, answer))
        
        user_data = cursor.fetchone()

        if user_data:
            column_names = [description[0] for description in cursor.description]
            flashcard_dict = dict(zip(column_names, user_data))

            timestamp_str = flashcard_dict["timestamp"]
            timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

            flashcard_dict["timestamp"] = timestamp.strftime("%d/%m/%Y")

            return flashcard_dict
        
        else:
            return None
        

def rate_flashcard(flashcard_id, rating):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("INSERT INTO flashcards_rating (flashcard_id, rating) VALUES(?, ?)",
                       (flashcard_id, rating))
        db.commit()

