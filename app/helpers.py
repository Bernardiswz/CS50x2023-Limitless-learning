from flask import redirect, render_template, session
from functools import wraps


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