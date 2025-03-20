# Limitless Learning Project #

## Video demo: https://youtu.be/YUfYhW9uMaY ## 

## Content table ##
+ [Introduction](#introduction)
+ [Prerequisites](#prerequisites)
+ [Overview](#overview)
+ [Installation](#installation)
+ [Structure](#structure)
+ [Context](#context)
+ [Theme](#theme)
+ [Construction](#construction)
+ [Contact Information and Licensing](#contact-information-and-licensing)

## Introduction ##
Hello! Welcome to my project "Limitless Learning", this website was designed with the intent of provide the user with some 
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

1. Create a virtual environment with Python on the folder that the project will be stored by executing `python -m venv venv`, if you are using python3 execute `python3 -m venv venv`

2. Activate the virtual environment by executing `.\venv\Scripts\activate` on Windows or `source ./venv/bin/activate` on Linux and macOS.

3. Install the required dependencies through the use of `pip install package_name` and `npm install package-name`, the latter on the [js](app/static/js/) folder so that the Python and JavaScript dependencies are organized in their respective place, or by running `pip install -r requirements.txt`, always remember to run `pip freeze > requirements.txt` to replace the package names and versions to match the ones that were just installed.

4. When you're done, deactivate the virtual environment by running `deactivate` on the terminal.

### Structure ###
The [app](app) folder stores the Python files of the project aswell as cache and session data that is created by the Flask framework for the
expected behavior of the application. It also includes the [static](app/static/) folder which contains all the CSS, images and audio required
for the client-side interface, aswell as the JavaScript files and the required frameworks and modules in [node_modules](app/static/js/node_modules). The HTML of the page is in the [templates](app/templates/) folder. The main website logo was created by me although quite generic, the other images were taken from google images and were edited to remove background or some inconsistencies in the image through the use of [Online Png Tools](https://onlinepngtools.com/).

Also on the main project folder, there's the [db](db) folder that stores the .sql file with the schema of the database and also the database file itself. And the Python virtual environment is in the [venv](venv) folder. The files and folders are organized according to their functions within the context of the application and in which route or template they will be used, making it easy to navigate and relate the files to one another according to their functionality. And lastly the [screenshots](screenshots/) folder with some screenshots of how the application look like on client-side.

### Context ###
My name is Bernardo Alekhine, I am 16 years old as of 2023, born in Brazil and I got a deeper grasp of the english language between 2019-2021 on my own. And I started to learn about programming between March and April of this year. I started with a Python course from the youtuber [Bro Code](https://www.youtube.com/@BroCodez) and I found programminmg to be quite enjoyable and fun, not only that but I started to have a deeper interest in this subject area, including potentially for carreer purposes and work.

Ever since I was a kid I was exposed to computers and technology, even if they weren't the best at the time, which in turn contributed to my digital literacy, and I also liked playing games. After getting the main grasp of Python and programming through the help of Bro Code's videos and courses, I decided to search for something more abrangent and that could provide me with some way of certify my skills and what I've learned.

Be it on the context of a certificate which is nothing but a simple display of what you went through, but more in the context of the learning experience and the projects you make. Throughout the CS50 course I was pushed to my limits to figure out about programming and apply it on a real context through the different projects and problem sets proposed in the course.

It was also a great assistor for me to finally get the initial push to develop a project of my own, which is this project here right now. I started developing it in november second and it's been an ongoing process for about 2 months. I can say that I enjoyed every part of it, even the darkest rabbit hole glitches and bugs that showed up that drived me nuts, I managed to continue and I guess finish it, even though there's room for improvement and not everything went as planned. But as my first project, I can say I learned a lot from it, and I am glad to say that this will be the first project of many to come.

### Theme ###
The core idea of this website touches on a subject matter of extreme importance, not only for me but for everyone and all, which is the process of learning, studying and acquiring new skills and knowledge. As I was developing this website I also took the coursera courses [Learning How to Learn](https://www.coursera.org/learn/learning-how-to-learn), [Mindshift](https://www.coursera.org/learn/mindshift) and [Introduction to Pyschology](https://www.coursera.org/learn/introduction-psychology). All of those courses built upon the knowledge I searched for in terms of not only learning but perception of the world around as a whole.

The skill and knowledge of learning isn't limited to one specific subject but it has a broader range and can help you in anything you need or want. Therefore after spending some time thinking of an idea, this idea came in mind, what if I make a website that can help me in my learning journey to any subject I want?

The two main tools for the website are built upon the fundamentals of the Pomodoro and Flashcards techniques mentioned earlier, these two being the ones I found to be the most straight to the point to implement their functionality (there's many others but I decided to dive deeper in these two). And also having a way to keep track of your progress and seeing your improvement and how often you've been studying was something necessary to contain in the website too, with that I started building this website.

### Construction ###
Some say the best skill you might acquire as an programmer is the art of googling and searching for how to solve your problems efficiently, and I kinda would agree with that. Imagine if I needed to figure out on my own that to perform operations from client-side to be handled server-side I would need to specifically download the jquery library? Or the toughest of all (not really), center a div and its elements?

What I didn't know or had trouble, I used AI such as Chat GPT to explain me harder concepts or give suggestions and searched for other people's insights in platforms as [Stack Overflow](https://stackoverflow.com/), [Reddit](https://www.reddit.com/) and also reading the documentations of the Frameworks or modules that I used on my project.

The most important is to have resilience and even when you start feeling that you shouldn't do this or that it is too hard, try to reason on these thoughts and overcome them, that way you will become limitless.

#### Contact Information and licensing ####
+ GitHub: [Bernardiswz](https://github.com/Bernardiswz)
+ LinkedIn [Bernardo Alekhine](https://www.linkedin.com/in/bernardo-alekhine-461791299)

All third party libraries and modules used were mentioned throughout this file aswell as in the [requirements](requirements.txt) file.
This was my first project and it's intended for inspiration and learning purposes. It may not be production-ready and/or fully fledged.
