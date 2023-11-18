CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    minutes INTEGER NOT NULL DEFAULT 25,
    break INTEGER NOT NULL DEFAULT 5,
    long_break INTEGER NOT NULL DEFAULT 15,
    lb_interval INTEGER NOT NULL DEFAULT 4, --Amount of pomodoros until interval
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_data (
    user_id INTEGER PRIMARY KEY NOT NULL,
    pomodoros INTEGER NOT NULL,
    

);