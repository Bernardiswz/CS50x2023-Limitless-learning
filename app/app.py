"""
Hello! This is a Flask web application that providdes information about the importance of learning
and offers various learning resources. See the README for more information.
"""
from flask import Flask, redirect, render_template, request, session, g
from flask_session import Session
from helpers import login_required, is_valid_password, is_valid_username
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3


# Configure app
app = Flask(__name__)

# Configure to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Connecting to database
def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect("../db/learning.db")
    return db


@app.after_request
def after_request(response):
    # Make sure responses aren't cached
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Homepage
@app.route("/")
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

        # Instantiate database
        db = get_db()
        cursor = db.cursor()

        # Check for whether the same username already exists in the database
        cursor.execute("SELECT username FROM users WHERE username = ?", (username, ))
        existing_username = cursor.fetchone()

        if existing_username:
            return 409
        
        # Generate password hash and insert it in database with the registered user data
        password_hash = generate_password_hash(password)
        
        cursor.execute("INSERT INTO users (username, hash) VALUES(?, ?)", (username, password_hash))
        db.commit()
        cursor.close()

        return redirect("/login")
    
    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        pass

    else:
        return render_template("login.html")


@app.route("/pomodoro", methods=["GET", "POST"])
# @login_required
def pomodoro():
    if request.method == "POST":
        minutes = request.form.get("minutes")
        timer_break = request.form.get("break")
        long_break = request.form.get("long_break")

        # Assigning default values to the timer elements
        default_minutes = 25
        default_break = 5
        default_long_break = 15 # Long break interval
        default_lb_interval = 4 # Amount of pomodoros to reach long break

        form_elements = [minutes, timer_break, long_break]

        # Function to check for valid ints as user input
        def is_valid_element(element):
            return element.isdigit() and int(element) > 0


        """If element isn't valid then assign it its default value"""
        # Handling minutes
        if not is_valid_element(minutes):
            minutes = default_minutes

        # Handling break
        if not is_valid_element(timer_break):
            timer_break = default_break

        # Handling long break
        if not is_valid_element(long_break):
            long_break = default_long_break

        redirect("/")
                  
    
    else:
        timer_minutes = 25
        timer_break = 5
        long_break = 5

        return render_template("pomodoro.html", minutes=timer_minutes, timer_break=timer_break, long_break=long_break)


@app.route("/about")
def about():
    return render_template("about.html")