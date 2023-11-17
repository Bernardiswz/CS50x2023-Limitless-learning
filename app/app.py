"""
This is a Flask web application that providdes information about the importance of learning
and offers various learning resources. See the README for more information.
"""
from flask import Flask, redirect, render_template, request, session, g
from flask_session import Session
from helpers import login_required, is_valid_password, is_valid_username, get_db, register_user, authenticate_user, render_error


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
            return 403

        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or password != confirm_password or not check_username:
            return 404

        user_id = register_user(username, password)

        if user_id is None:
            return 409
        
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
            return 403

        check_password = is_valid_password(password)
        check_username = is_valid_username(username)

        if not check_password or not check_username:
            return 404

        user_id = authenticate_user(username, password)

        if not user_id:
            return render_error("Wrong password or wrong name!", 404)
        
        # If matches update user id to match user id from db
        session["user_id"] = user_id

        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()

    return redirect("/")


@app.route("/pomodoro", methods=["GET", "POST"])
@login_required
def pomodoro():
    # Get default options from current user if no form is submitted
    user = session.get("user_id")

    # Initialize variables to hold the values of the database query
    minutes = None
    timer_break = None
    long_break = None
    lb_interval = None

    """Querying database to retreive user's preferences of the pomodoro timer"""
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("SELECT minutes, break, long_break, lb_interval FROM preferences WHERE user_id = ?", (user,))
        user_data = cursor.fetchone()

        if user_data:
            minutes, timer_break, long_break, lb_interval = user_data

        else:
            return None

    if request.method == "POST":
        minutes = request.form.get("minutes")
        timer_break = request.form.get("break")
        long_break = request.form.get("long_break")
        lb_interval = 4

        # Assigning default values to the timer elements

        form_elements = [minutes, timer_break, long_break]

        # Function to check for valid ints as user input
        def is_valid_element(element):
            try:
                num = int(element)
                return num > 0
            
            except ValueError:
                return False


        with get_db() as db:
            cursor = db.cursor()
            # handling minutes
            if is_valid_element(minutes):
                cursor.execute("UPDATE preferences SET minutes = ? WHERE user_id = ?",
                            (minutes, user))

            # Handling break
            if is_valid_element(timer_break):
                cursor.execute("UPDATE preferences SET break = ? WHERE user_id = ?",
                            (timer_break, user))

            # Handling long break
            if is_valid_element(long_break):
                cursor.execute("UPDATE preferences SET long_break = ? WHERE user_id = ?",
                            (long_break, user))
                
            db.commit()

        return render_template("pomodoro.html", minutes=minutes, timer_break=timer_break, long_break=long_break)
                  
    else:
        return render_template("pomodoro.html", minutes=minutes, timer_break=timer_break, long_break=long_break)


@app.route("/about")
@login_required
def about():
    return render_template("about.html")


@app.route("/error")
def error():
    return render_template("error.html")