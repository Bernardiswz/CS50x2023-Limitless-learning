# Title for later #

## Introduction ##
Hello! Welcome to my project [name later], this website was designed with the intent of provide the user with some 
tools to assist in their learning and practice of any subject of their choice. Including a Pomodoro timer aswell as
customizable flashcards that can be created and practiced, not only that but the website also provides the user with
insights on their progress in these techniques. 

With the use of Flask as the backend framework for Python to the server-side aspect of the project alongside HTML, CSS, JavaScript and a SQL database, handled by sqlite3, aswell as other frameworks (dependencies on [Requirements](requirements.txt)), this project was made possible.
This file will provide a documentation and brief summary on the different aspects of the project and its structure.

## Prerequisites ##
Before you begin, ensure you have met the following requirements:
+ Python 3.12.0 or later: [Download Python](https://www.python.org/downloads/)
+ SQLite 3.43.2 or later: [Download SQLite](https://www.sqlite.org/download.html)
+ Node.js and npm: [Download Node.js](https://nodejs.org/en/download)

### Overview ###
Upon entering the website, the user is prompted to register an account on the [Register route](app/templates/register.html) so that he is able to have access to the application, the feedbacks of the UI on client-side code aswell as intuitive design makes this task very straight to the point to do. The inputs are sanitized both on client and server-side, to handle unexpected input and give the appropriate responses. After login-in, the user has a navbar to efficiently access all the different routes the website provides, the navbar also contains a logout button.

The [Index route](app/templates/index.html) serves as the homepage and displays the user's progress and stats in regards to their use of the
[Pomodoro route](app/templates/pomodoro.html) and the [Flashcards route](app/templates/flashcards.html). The project html structure relies on the use
of jinja2 templates to easily and dynamically extend layouts and update pages in harmony with server-side code. 
The [About route](app/templates/about.html) provides a short introduction of the project's functionalities aswell as resources to learn about
the Flashcards and Pomodoro technique in case the user doesn't know, including links to courses in the subject matter of learning. The 
[History route](app/templates/history.html) keeps track of actions of the user, including the finish of a Flashcard session and a Pomodoro
session, the timestamp is shown in a MM/DD/YYYY format.

The main routes Pomodoro and Flashcards, allow the user to modify their preferences (in this case the Pomodoro timer), and edit or delete their
flashcards. On the index route includes a section to delete the user account or progress, in this case the user is prompted their password and asked
confirmation, if the password matches and the user confirms, their user data or account including everything related to it is deleted from the project's database.

### Installation ###
The steps to setup the web application are as follows:

1. Create a virtual enviroment with Python on the folder that the project will be stored by executing `python -m venv venv`, if you are using python3 execute `python3 -m venv venv`

2. Activate the virtual enviroment by executing `.\venv\Scripts\activate` on Windows or `source ./venv/bin/activate` on Linux and macOS.

3. Install the required dependencies through the use of `pip install package_name` and `npm install package-name`, the latter on the [js](app/static/js/) folder so that the Python and JavaScript dependencies are organized in their respective place, or by running `pip install -r requirements.txt`, always remember to run `pip freeze > requirements.txt` to replace the package names and versions to match the ones that were just installed.

4. When you're done, deactivate the virtual enviroment by running `deactivate` on the terminal.

### Structure ###
The [app](app) folder stores the Python files of the project aswell as cache and session data that is created by the Flask framework for the
expected behavior of the application. It also includes the [static](app/static/) folder which contains all the CSS, images and audio required
for the client-side interface, aswell as the JavaScript files and the required frameworks and modules in [node_modules](app/static/js/node_modules). The HTML of the page is in the [templates](app/templates/) folder.

Also on the main project folder, there's the [db](db) folder that stores the .sql file with the schema of the database and also the database file itself. And the Python virtual enviroment is in the [venv](venv) folder. The files and folders are organized according to their functions within the context of the application and in which route or template they will be used, making it easy to navigate and relate the files to one another according to their functionality.

### Construction ###
