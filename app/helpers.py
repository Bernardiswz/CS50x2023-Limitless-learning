"""
This is the helper file, it provides with the required db queries functions and related utilities
"""
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


def is_valid_paramether(*paramethers):
    for paramether in paramethers:
        if not paramether:
            return False
    return True


# Returns the valid key value pairs given as arguments to the function
def get_valid_paramethers(**paramethers):
    valid_paramethers = {}

    for key, value in paramethers.items():
        if value:
            valid_paramethers[key] = value

    return valid_paramethers


def render_error(message, status_code):
    return render_template("error.html", message=message, status_code=status_code)


# Database init function
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
            return None

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


def format_timestamp(timestamp):
    formatted_timestamp = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
    return formatted_timestamp

# Function to check whether an element is valid to insert into preferences
def is_valid_element(element):
    try:
        num = int(element)
        return num > 0

    except ValueError:
        return False

def update_preferences(user_id, preferences_dict):
    with get_db() as db:
        cursor = db.cursor()

        for key, value in preferences_dict.items():
            if is_valid_element(value):
                query = f"UPDATE preferences SET {key} = ? WHERE user_id = ?"

                cursor.execute(query, (value, user_id))
        
        db.commit()


def query_preferences(user_id):
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT minutes, timer_break, long_break, lb_interval FROM preferences WHERE user_id = ?", (user_id,))
        user_data = cursor.fetchone()

        if user_data:
            user_data_dict = {
                "minutes": user_data[0],
                "timer_break": user_data[1],
                "long_break": user_data[2],
                "lb_interval": user_data[3]
            }            

            return user_data_dict


def register_history_action(user_id, action):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("INSERT INTO history (user_id, action) VALUES(?, ?)", (user_id, action))
        db.commit()


def increment_pomodoros(user_id):
    action = "finished_pomodoro"
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("UPDATE user_data SET pomodoros_finished = pomodoros_finished + 1 WHERE user_id = ?", (user_id,))
        
        register_history_action(user_id, action)
        
        db.commit()


def create_flashcard(user_id, topic, question, answer):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("INSERT INTO flashcards (user_id, topic, question, answer) VALUES(?, ?, ?, ?)",
                       (user_id, topic, question, answer))

        db.commit()


def update_flashcard(elements_dict):
    with get_db() as db:
        cursor = db.cursor()

        flashcard_id = elements_dict.pop("flashcard_id")

        for key, value in elements_dict.items():
            query = f"UPDATE flashcards SET {key} = ? WHERE flashcard_id = ?"
            cursor.execute(query, (value, flashcard_id))
        
        db.commit()   


def delete_flashcard(flashcard_id):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("DELETE FROM flashcards WHERE flashcard_id = ?", (flashcard_id,))
        db.commit()     


def validate_update_inputs(inputs_dict):
    flashcard_id = inputs_dict.pop("flashcard_id")

    flashcard_to_edit = get_flashcard_content_by_id(flashcard_id)

    # Include flashcard_id in returning dict for convenience
    valid_input_dict = {"flashcard_id": flashcard_id}

    # If input doesn't match the flashcard it is considered valid, to prevent useless queries
    for key, value in inputs_dict.items():
        if value != flashcard_to_edit[key]:
            valid_input_dict[key] = value

    return valid_input_dict


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

            flashcard_dict = {
                "flashcard_id": row[0],
                "topic": row[1],
                "question": row[2],
                "answer" : row[3],
                "timestamp": timestamp.strftime("%m/%d/%Y")
            }
            
            user_flashcards.append(flashcard_dict)

    return user_flashcards


def get_flashcard_ratings(flashcard_id):
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT rating FROM flashcards_rating WHERE flashcard_id = ?", (flashcard_id,))
        flashcard_ratings = cursor.fetchall()

        return flashcard_ratings


def get_most_recent_rating(flashcard_id):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("SELECT rating FROM flashcards_rating WHERE flashcard_id = ? ORDER BY timestamp DESC LIMIT 1",
                       (flashcard_id,))
        most_recent_rating = cursor.fetchone()

        return most_recent_rating
    

def count_flashcard_ratings(ratings_dict):
    rating_count_dict = {
        "very-easy": 0,
        "easy": 0,
        "medium": 0,
        "hard": 0,
        "very-hard": 0
    }

    for rating in ratings_dict:
        if rating[0] in rating_count_dict:
            rating_count_dict[rating[0]] += 1

    return rating_count_dict


def rate_flashcard(flashcard_id, rating):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("INSERT INTO flashcards_rating (flashcard_id, rating) VALUES(?, ?)", (flashcard_id, rating))

        db.commit()


def query_flashcard_ratings(flashcard_id):
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT rating, timestamp FROM flashcards_rating WHERE flashcard_id = ?", (flashcard_id,))
        ratings = cursor.fetchall()
        ratings_list = []

        for rating in ratings:
            ratings_dict = {
                "rating": rating[0],
                "timestamp": rating[1]
            }

            ratings_list.append(ratings_dict)
        return ratings_list


def get_flashcard_by_user_data(user_id, topic, question, answer):
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

            flashcard_dict["timestamp"] = timestamp.strftime("%m/%d/%Y")

            return flashcard_dict
        
        else:
            return None
        

def get_flashcard_content_by_id(flashcard_id):
    with get_db() as db:
        cursor = db.cursor()

        cursor.execute("SELECT topic, question, answer FROM flashcards WHERE flashcard_id = ?", (flashcard_id,))
        flashcard = cursor.fetchone()
        flashcard_dict = {
            "topic": flashcard[0],
            "question": flashcard[1],
            "answer": flashcard[2],
        }
        
        return flashcard_dict


def query_user_data(user_id):
    with get_db() as db:
        cursor = db.cursor()

        # Query username
        cursor.execute("SELECT username FROM users WHERE user_id = ?", (user_id,))
        username = cursor.fetchone()[0]

        # Querying preferences
        cursor.execute("SELECT minutes, timer_break, long_break, lb_interval FROM preferences WHERE user_id = ?", (user_id,))
        user_preferences_data = cursor.fetchone()
        user_preferences_dict = {
            "minutes": user_preferences_data[0],
            "timer_break": user_preferences_data[1],
            "long_break": user_preferences_data[2],
            "lb_interval": user_preferences_data[3]
        }

        # Query user flashcards and append a dict of its respective ratings
        user_flashcards = get_flashcards(user_id)

        # Var to count finished flashcards as they are added to the dict
        flashcards_finished = 0

        for flashcard in user_flashcards:
            current_flashcard_id = flashcard["flashcard_id"]
            query_flashcard_rating = query_flashcard_ratings(current_flashcard_id)

            for rating in query_flashcard_rating:
                formatted_timestamp = format_timestamp(rating["timestamp"])
                rating["timestamp"] = formatted_timestamp.strftime("%m/%d/%Y")

            flashcard["ratings"] = query_flashcard_rating

            # Create count key for ratings
            flashcard_ratings = get_flashcard_ratings(current_flashcard_id)
            ratings_count = count_flashcard_ratings(flashcard_ratings)

            for value in ratings_count.values():
                flashcards_finished += value

        
        # Queries for stats
        cursor.execute("SELECT COUNT(*) FROM flashcards WHERE user_id = ?", (user_id,))
        flashcards_count = cursor.fetchone()[0]

        cursor.execute("SELECT pomodoros_finished FROM user_data WHERE user_id = ?", (user_id,))
        pomodoros_finished = cursor.fetchone()[0]


        user_stats_dict = {
            "pomodoros_finished": pomodoros_finished,
            "flashcards_finished": flashcards_finished,
            "flashcards_count": flashcards_count,
        }

        # Query history
        cursor.execute("SELECT action, timestamp FROM history WHERE user_id = ? and action = 'finished_pomodoro' ORDER BY timestamp ASC", 
                       (user_id,))
        finished_pomodoros = cursor.fetchall()
        pomodoros_history_list = []

        for row in finished_pomodoros:
            formatted_timestamp = format_timestamp(row[1])

            pomodoros_finished_dict = {
                "action": row[0],
                "timestamp": formatted_timestamp.strftime("%m/%d/%Y")
            }

            pomodoros_history_list.append(pomodoros_finished_dict)

        user_data_dict = {
            "username": username, 
            "user_preferences": user_preferences_dict, 
            "user_flashcards": user_flashcards, 
            "user_stats": user_stats_dict,
            "pomodoros_history": pomodoros_history_list
        }

        return user_data_dict
    

def format_user_data(user_data):
    for flashcard in user_data["user_flashcards"]:
        for rating in flashcard["ratings"]:
            formatted_rating = " ".join(word.capitalize() for word in rating["rating"].split("-"))
            rating["rating"] = formatted_rating
