function main() {
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const buttonSound = document.getElementById("button-sound");
    const timeupSound = document.getElementById("timeup-sound");
    const inputContainer = document.getElementById("inputs");

    // Pop up settings variables
    const minutesInput = document.getElementById("minutes-input");
    const breakInput = document.getElementById("break-input");
    const longBreakInput = document.getElementById("long-break-input");

    // Load values from sessionStorage or use default values
    let minutes = parseInt(sessionStorage.getItem("minutes-input")) || parseInt(minutesInput.value);
    let timerBreak = parseInt(breakInput.value);
    let longBreak = parseInt(longBreakInput.value);

    // Initializing variables of time and to dynamism between the on and off states of the button
    let time = minutes * 60;
    let intervalId;
    let timerRunning = false;
    let waiting = false;
    let timeBreak = false;
    let pomodoros = 0;

    // Update the timer element on page load
    timerElement.textContent = `${minutes}:00`;

    // Add an event listener to the input container to handle changes in any input element
    inputContainer.addEventListener("input", function (event) {
        const target = event.target;

        if (target.matches(".settings-input")) {
            // Handle changes in input elements with class 'settings-input'
            const name = target.name;
            const value = parseInt(target.value);

            switch (name) {
                case "minutes":
                    minutes = value;
                    break;
                case "break":
                    timerBreak = value;
                    break;
                case "long_break":
                    longBreak = value;
                    break;
            }

            if (!timerRunning && !timeBreak) {
                time = minutes * 60; // Update the 'time' variable
                timerElement.textContent = `${minutes}:00`; // Update the timer element
            }
        }
    });

    function updateCountDown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.innerHTML = formattedTime;
        time--;

        if (time < 0) {
            clearInterval(intervalId);
            timerRunning = false;
            timeupSound.play();

            // Automatically start the break timer
            if (!timeBreak) {
                pomodoros++;
            }
            
            startBreak();
        }
    }

    function startBreak() {
        // Set break or long break based on your conditions
        if (timerBreak && pomodoros < 4) {
            time = timerBreak * 60;
        } else if (timerBreak && pomodoros === 4) {
            time = longBreak * 60;
            pomodoros = 0;
        }
        timeBreak = !timeBreak;
        resetTimer(); // Reset the timer before updating the button text
        startTimer(); // Automatically start the break timer
        // Update the timer element AFTER starting the timer
        timerElement.textContent = timeBreak ? `${timerBreak}:00` : `${longBreak}:00`;
    }

    function resetTimer() {
        time = minutes * 60;
        timerElement.textContent = `${minutes}:00`; // Update the timer element
        startButton.textContent = "Start";
    }

    function startTimer() {
        buttonSound.play();

        if (!timerRunning && !waiting) {
            waiting = true;
            startButton.textContent = "Pause";
            intervalId = setInterval(updateCountDown, 1000);
            timerRunning = true;
            setTimeout(() => {
                waiting = false;
            }, 1000); // Delay for about 1 second (1000 milliseconds)
        } else if (timerRunning) {
            clearInterval(intervalId);
            timerRunning = false;
            startButton.textContent = "Start";
        }
    }

    startButton.addEventListener("click", startTimer);
}

document.addEventListener("DOMContentLoaded", main);
