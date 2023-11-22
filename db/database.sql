CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS preferences (
    user_id INTEGER PRIMARY KEY,
    minutes INTEGER NOT NULL DEFAULT 25,
    break INTEGER NOT NULL DEFAULT 5,
    long_break INTEGER NOT NULL DEFAULT 15,
    lb_interval INTEGER NOT NULL DEFAULT 4, --Amount of pomodoros until interval
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    topic TEXT,
    question TEXT,
    answer TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS user_data (
    user_id INTEGER PRIMARY KEY,
    pomodoros_finished INTEGER NOT NULL DEFAULT 0,
    correct_flashcards INTEGER NOT NULL DEFAULT 0,
    incorrect_flashcards INTEGER NOT NULL DEFAULT 0,
    flashcards_amount INTEGER NOT NULL DEFAULT 0, --Total amount of flash cards created and active
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
