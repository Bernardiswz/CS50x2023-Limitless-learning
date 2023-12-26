"""
This is the main app file, the routes are stored here, helper files in helpers.py
"""
from flask import Flask, g, jsonify, redirect, render_template, request, session, abort
from flask_session import Session
from helpers import *


# Configure app
app = Flask(__name__)

# Configure to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Define routes that can only be accessed if the user isn't logged in
@app.before_request
def check_session():
    restricted_routes = ["login", "register"]

    if "user_id" in session and request.endpoint in restricted_routes:
        return redirect("/")


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
    user_id = session.get("user_id")
    user_data = query_user_data(user_id)

    return render_template("index.html", user_data=user_data)


@app.route("/register", methods=["GET", "POST"])
def register():
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect("/")


@app.errorhandler(Exception)
def error(error):
    error_message = str(error)
    status_code = getattr(error, 'code', 500)

    return render_template("error.html", status_code=status_code, message=error_message)


@app.route("/about")
@login_required
def about():
    return render_template("about.html")


@app.route("/pomodoro")
@login_required
def pomodoro():
    # Get default options from the current user if no form is submitted
    user_id = session.get("user_id")
    
    if not user_id:
        abort(400)

    user_preferences = query_preferences(user_id)

    return render_template("pomodoro.html", user_preferences=user_preferences)


@app.route("/flashcards")
@login_required
def flashcards():
    user_id = session.get("user_id")
    user_flashcards = get_flashcards(user_id)

    return render_template("flashcards.html", flashcards=user_flashcards)


@app.route("/history")
@login_required
def history():
    user_id = session.get("user_id")

    if not user_id:
        abort(400)

    user_data = query_user_data(user_id)
    format_user_data(user_data)

    return render_template("history.html", user_data=user_data)


@app.route("/operations_no_login", methods=["POST"])
def try_authentication():
    operation = request.form.get("operation")
    is_valid_operation = is_valid_paramether(operation)

    if not is_valid_operation:
        return jsonify({
                "success": False
            })

    if operation == "tryAuthentication":
        username = request.form.get("username")
        password = request.form.get("password")

        # # Validate user input
        is_valid_inputs = is_valid_paramether(username, password)

        if not is_valid_inputs:
            return jsonify({
                "success": False
            })


        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or not check_username:
            return jsonify({
                "success": False
            })

        user_id = authenticate_user(username, password)

        if user_id is None:
            return jsonify({
                "success": False
            })
        
        # If matches update user id to match user id from db
        session["user_id"] = user_id

        return jsonify({
            "success": True
        })
    
    elif operation == "registerUser":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirmPassword")

        is_valid_inputs = is_valid_paramether(username, password, confirm_password)

        if not is_valid_inputs:
            return jsonify({
                "success": False
            })

        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or password != confirm_password or not check_username:
            return jsonify({
                "success": False
            })

        user_id = register_user(username, password)

        if user_id is None:
            return jsonify({
                "success": False
            })
        
        else:
            return jsonify({
                "success": True
            })


@app.route("/operations_server_side", methods=["POST"])
@login_required
def operations():
    user_id = session.get("user_id")
    operation = request.form.get("operation")

    is_valid_operation = is_valid_paramether(user_id, operation)

    if not is_valid_operation:
        abort(400)

    if operation == "incrementPomodoros":
        increment_pomodoros(user_id)

        return jsonify({
            'sucess': True
        })

    elif operation == "updatePomodoro":
        minutes = request.form.get("minutes")
        timer_break = request.form.get("timerBreak")
        long_break = request.form.get("longBreak")
        lb_interval = request.form.get("lbInterval")

        valid_preferences = get_valid_paramethers(minutes=minutes, timer_break=timer_break, long_break=long_break, lb_interval=lb_interval)
        update_preferences(user_id=user_id, preferences_dict=valid_preferences)

        return jsonify({
            'minutes': minutes,
            'timer_break': timer_break,
            'long_break': long_break
        })

    elif operation == "createFlashcard":
        topic = request.form.get("topic")
        question = request.form.get("question")
        answer = request.form.get("answer")

        create_flashcard(user_id=user_id, topic=topic, question=question, answer=answer)
        created_flashcard = get_flashcard_by_user_data(user_id=user_id, topic=topic, question=question, answer=answer)

        return jsonify({
            'createdFlashcard': created_flashcard
        })

    elif operation == "flashcardFeedback":
        flashcard_id = request.form.get("flashcardId")
        rating = request.form.get("buttonValue")

        rate_flashcard(flashcard_id, rating)

        return jsonify({
            "success": True
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

        if not flashcard_id:
            abort(400)

        delete_flashcard(flashcard_id)

        return jsonify({
            "flashcardToDeleteId": flashcard_id
        })
    
    elif operation == "getFlashcardRatings":
        flashcard_id = request.form.get("flashcardId")

        if not flashcard_id:
            abort(400)

        flashcard_ratings = get_flashcard_ratings(flashcard_id)
        flashcard_ratings_count = count_flashcard_ratings(flashcard_ratings)
        most_recent_rating = get_most_recent_rating(flashcard_id)

        return jsonify({
            "flashcardRatingsCount": flashcard_ratings_count,
            "mostRecentRating": most_recent_rating
        })
    
    elif operation == "queryUserData":
        user_data = query_user_data(user_id)
        return jsonify({
            "userData": user_data
        })
        
    elif operation == "checkUserPassword":
        password = request.form.get("password")

        if not password:
            return jsonify({
                "success": False
            })
        
        is_password_valid = check_user_password(user_id, password)

        if is_password_valid:
            return jsonify({
                "success": True
            })

        else:
            return jsonify({
                "success": False
            })

    elif operation == "deleteUserProgress":
        delete_user_progress(user_id)

        return jsonify({
            "succes": True
        })
    
    elif operation == "deleteAccount":
        delete_user_account(user_id)
        session.clear()
        return redirect("/")

    else:
        abort(400)


if __name__ == "__main__":
    app.run(debug=True)
