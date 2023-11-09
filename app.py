"""
Hello! This is a Flask web application that providdes information about the importance of learning
and offers various learning resources. See the README for more information.
"""
from flask import Flask, redirect, render_template, request, session
import sqlite3

# Configure app
app = Flask(__name__)

# Connecting to database file and creating a cursor to run commands
db = sqlite3.connect("learning.db")
cursor = db.cursor()

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


@app.route("/pomodoro", methods=["GET", "POST"])
def pomodoro():
    if request.method == "POST":
        pass
    
    else:
        return render_template("pomodoro.html")


@app.route("/about")
def about():
    return render_template("about.html")