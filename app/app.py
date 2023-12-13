"""
This is a Flask web application that providdes information about the importance of learning
and offers various learning resources. See the README for more information.
"""
from flask import Flask, g, jsonify, redirect, render_template, request, session, abort
from flask_session import Session
from datetime import datetime
from helpers import *


# Configure app
app = Flask(__name__)

# Configure to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.after_request
def after_request(response):
    # Make sure responses aren't cached
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Homepage
@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # Validate user input
        if not username or not password or not confirm_password:
            abort(400)

        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or password != confirm_password or not check_username:
            return abort(400)

        user_id = register_user(username, password)

        if user_id is None:
            abort(409)
        
        return redirect("/login")
    
    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Forget any user_id
    session.clear()

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Validate user input
        if not username or not password:
            return abort(400)

        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or not check_username:
            return abort(400)

        user_id = authenticate_user(username, password)

        if user_id is None:
            return abort(409)
        
        # If matches update user id to match user id from db
        session["user_id"] = user_id

        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.errorhandler(Exception)
def error(error):
    error_message = str(error)
    status_code = getattr(error, 'code', 500)

    return render_template("error.html", status_code=status_code, message=error_message)


@app.route("/update_data", methods=["POST"])
@login_required
def update_data():
    user = session.get("user_id")
    operation = request.form.get("operation")

    is_valid_operation = is_valid_paramether(user, operation)

    if not is_valid_operation:
        abort(400)

    if operation == "incrementPomodoros":
        increment_pomodoros(user)

        return jsonify({
            'sucess': True
        })

    elif operation == "updatePomodoro":
        minutes = request.form.get("minutes")
        timer_break = request.form.get("timerBreak")
        long_break = request.form.get("longBreak")

        valid_preferences = get_valid_paramethers(minutes=minutes, timer_break=timer_break, long_break=long_break)
        update_preferences(user_id=user, preferences_dict=valid_preferences)

        return jsonify({
            'minutes': minutes,
            'timer_break': timer_break,
            'long_break': long_break
        })

    elif operation == "createFlashcard":
        topic = request.form.get("topic")
        question = request.form.get("question")
        answer = request.form.get("answer")

        create_flashcard(user_id=user, topic=topic, question=question, answer=answer)
        created_flashcard = get_flashcard_by_user_data(user_id=user, topic=topic, question=question, answer=answer)

        date_difference = get_date_difference(created_flashcard["timestamp"])
        created_flashcard["time_ago"] = date_difference

        return jsonify({
            'createdFlashcard': created_flashcard
        })

    elif operation == "flashcardFeedback":
        flashcard_id = request.form.get("flashcardId")
        rating = request.form.get("buttonValue")

        rate_flashcard(flashcard_id, rating)

        return jsonify({
            'tora': 'torator'
        })

    elif operation == "editFlashcard":
        flashcard_id = request.form.get("flashcardId")
        topic = request.form.get("topic")
        question = request.form.get("question")
        answer = request.form.get("answer")
 
        valid_paramethers = get_valid_paramethers(flashcard_id=flashcard_id, topic=topic, question=question, answer=answer)
        valid_inputs = validate_update_inputs(valid_paramethers)
        update_flashcard(valid_inputs)

        return jsonify({
            'updatedFlashcardData': valid_inputs
        })
    
    elif operation == "deleteFlashcard":
        flashcard_id = request.form.get("flashcardId")
        print(flashcard_id)

        delete_flashcard(flashcard_id)

        return jsonify({
            "flashcardToDeleteId": flashcard_id
        })
    
    elif operation == "getFlashcardRatings":
        flashcard_id = request.form.get("flashcardId")

        flashcard_ratings = get_flashcard_ratings(flashcard_id)
        flashcard_ratings_count = count_flashcard_ratings(flashcard_ratings)
        most_recent_rating = get_most_recent_rating(flashcard_id)

        return jsonify({
            "flashcardRatingsCount": flashcard_ratings_count,
            "mostRecentRating": most_recent_rating
        })
    
    elif operation == "queryUserData":
        print("reached")
        user_data = query_user_data(user)
        print(user_data)
        return jsonify({
            "userData": user_data
        })


@app.route("/pomodoro", methods=["GET", "POST"])
@login_required
def pomodoro():
    # Get default options from the current user if no form is submitted
    user = session.get("user_id")

    # Initialize variables to hold the values of the database query
    minutes = None
    timer_break = None
    long_break = None
    lb_interval = None

    """Querying the database to retrieve the user's preferences of the pomodoro timer"""
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT minutes, timer_break, long_break, lb_interval FROM preferences WHERE user_id = ?", (user,))
        user_data = cursor.fetchone()

        if user_data:
            minutes, timer_break, long_break, lb_interval = user_data

    return render_template("pomodoro.html", minutes=minutes, timer_break=timer_break, long_break=long_break)


@app.route("/flashcards", methods=["GET", "POST"])
@login_required
def flashcards():
    user_id = session.get("user_id")
    user_flashcards = get_flashcards(user_id)
    
    for flashcard in user_flashcards:
        flashcard["time_ago"] = get_date_difference(flashcard["timestamp"])

    return render_template("flashcards.html", flashcards=user_flashcards)


@app.route("/about")
@login_required
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True)
