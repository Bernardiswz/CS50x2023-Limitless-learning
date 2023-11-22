from flask import render_template, redirect, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from datetime import datetime
import sqlite3


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

        cursor.execute("SELECT topic, question, answer, timestamp FROM flashcards WHERE user_id = ?",
                   (user_id,))
        
        rows = cursor.fetchall()

        for row in rows:
            timestamp_str = row[3]
            timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

            flashcards_dict = {
                "topic": row[0],
                "question": row[1],
                "answer" : row[2],
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
