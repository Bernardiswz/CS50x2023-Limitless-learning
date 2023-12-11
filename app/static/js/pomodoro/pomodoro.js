const pomodoroElements = {
    timerElement: document.getElementById("timer"),
    startButton: document.getElementById("start-button"),
    buttonSound: document.getElementById("button-sound"),
    timeupSound: document.getElementById("timeup-sound"),
    inputContainer: document.getElementById("inputs"),

    // Pop up settings variables
    minutesInput: document.getElementById("minutes-input"),
    breakInput: document.getElementById("break-input"),
    longBreakInput: document.getElementById("long-break-input"),
};

const pomodoroVarObject = {
    ...pomodoroElements,
    // Load values from sessionStorage or use default values
    minutes: parseInt(sessionStorage.getItem("minutes-input")) || parseInt(pomodoroElements.minutesInput.value),
    timerBreak: parseInt(pomodoroElements.breakInput.value),
    longBreak: parseInt(pomodoroElements.longBreakInput.value),

    // Initializing variables of time and to dynamism between the on and off states of the button
    time: (parseInt(pomodoroElements.minutesInput.value) || 25) * 60,
    intervalId: undefined,
    timerRunning: false,
    waiting: false,
    timeBreak: false,
    isLongBreak: false,
    pomodoros: 0,
};

// Initiate the program and add event listeners to containers and buttons
function init() {
    const p = pomodoroVarObject;
    p.timerElement.textContent = `${pomodoroVarObject.minutes}:00`;
    p.inputContainer.addEventListener("input", (event) => handleInputContainer(event));
    p.startButton.addEventListener("click", startTimer);
}

function handleInputContainer(event) {
    const p = pomodoroVarObject;
    const target = event.target;

    if (target.matches(".settings-input")) {
        const name = target.name;
        let value = target.value.trim(); // Trim whitespace from the input value

        // Regular expression to match positive integers
        const integerPattern = /^[1-9]\d*$/;
        
        // Replace and update preferences's values according to user select
        switch (name) {
            case "minutes":
                if (!integerPattern.test(value)) {
                    target.value = value.replace(/[^0-9]/g, "");
                } else {
                    p.minutes = parseInt(value, 10);
                }
                break;

            case "break":
                if (!integerPattern.test(value)) {
                    target.value = "";
                } else {
                    p.timerBreak = parseInt(value, 10);
                }
                break;

            case "long_break":
                if (!integerPattern.test(value)) {
                    target.value = "";
                } else {
                    p.longBreak = parseInt(value, 10);
                }
                break;
        }

        // Set timer accordingly to the current state the timer is in, if it isn't running
        if (!p.timerRunning) {
            if (p.timeBreak) {
                setTimer(p.timerBreak);
            } else if (p.isLongBreak) {
                setTimer(p.longBreak);
            } else {
                setTimer(p.minutes);
            }
        }
    }
}

function setTimer(minutes) {
    const p = pomodoroVarObject;
    p.time = minutes * 60;
    p.timerElement.textContent = `${minutes}:00`;
}

function startTimer() {
    const p = pomodoroVarObject;
    p.buttonSound.play();

    if (!p.timerRunning && !p.waiting) {
        p.waiting = true;
        p.startButton.textContent = "Pause";
        p.intervalId = setInterval(updateCountDown, 1000);
        p.timerRunning = true;
        setTimeout(() => {
            p.waiting = false;
        }, 1000); // Delay for about 1 second (1000 milliseconds)
    } else if (p.timerRunning) {
        clearInterval(p.intervalId);
        p.timerRunning = false;
        p.startButton.textContent = "Start";
    }
}    

function resetTimer() {
    const p = pomodoroVarObject;
    p.time = p.minutes * 60;
    p.timerElement.textContent = `${p.minutes}:00`; // Update the timer element
    p.startButton.textContent = "Start";
}

function startBreak() {
    const p = pomodoroVarObject;

    if (p.timerBreak && p.pomodoros < 4) {
        p.time = p.timerBreak * 60;
        p.isLongBreak = false;
        p.timerElement.textContent = `${p.timerBreak}:00`;
        
    } else if (p.timerBreak && p.pomodoros === 4) {
        p.time = p.longBreak * 60;
        p.pomodoros = 0;
        p.isLongBreak = true;
        p.timerElement.textContent = `${p.longBreak}:00`;
    }
}

function updateCountDown() {
    const p = pomodoroVarObject;
    const minutesDisplay = Math.floor(p.time / 60);
    let seconds = p.time % 60;

    const formattedTime = `${minutesDisplay}:${seconds.toString().padStart(2, '0')}`;
    p.timerElement.innerHTML = formattedTime;
    p.time--;

    if (p.time < 0) {
        clearInterval(p.intervalId);
        p.timerRunning = false;
        p.timeupSound.play();

        resetTimer();
        // If is break time, update countdown
        p.timeBreak = !p.timeBreak;

        if (p.timeBreak) {
            incrementPomodoroOnServer();
            p.pomodoros++;
            startBreak();
        }
    }
}

function incrementPomodoroOnServer() {
    $.ajax({
        type: "POST",
        url: "/update_data",
        data: {
            operation: "incrementPomodoros"
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
