function main() {
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const buttonSound = document.getElementById("button-sound");
    const timeupSound = document.getElementById("timeup-sound");

    // Pop up settings variables
    const minutesInput = document.getElementById("minutes-input");
    const breakInput = document.getElementById("break-input");
    const longBreakInput = document.getElementById("long-break-input");

    minutesInput.addEventListener("input", updateTimer);
    let minutes = parseInt(minutesInput.value);
    let timerBreak = parseInt(breakInput.value);
    let longBreak = parseInt(longBreakInput.value);

    // Initializing variables of time and to dynamism between the on and off states of the button
    
    let time = minutes * 60;
    let intervalId;
    let timerRunning = false;
    let waiting = false;
    let timeBreak = false;

    function updateTimer() {
        const inputValue = parseInt(minutesInput.value);
        sessionStorage.setItem("minutes-input", inputValue);
        minutes = inputValue; // Update the 'minutes' variable
        time = minutes * 60; // Update the 'time' variable
        timerElement.textContent = `${minutesInput.value}:00`;
    }

    function updateCountDown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.innerHTML = formattedTime;
        time--;

        if (time <= 0) {
            clearInterval(intervalId);
            timerRunning = false;
            timeupSound.play();
            
            // If it's a work session, switch to break; otherwise, reset to initial state
            if (!timeBreak) {
                startBreak();
            } else {
                resetTimer();
            }
        }
    }

    function startTimer() {
        buttonSound.play();

        if (!timerRunning && !waiting) {
            waiting = true;
            setTimeout(() => {
                waiting = false;
                startButton.textContent = "Pause";
                updateCountDown();
                intervalId = setInterval(updateCountDown, 1000);
                timerRunning = true;
            }, 1000); // Delay for about 1 second (1000 milliseconds)
        } else if (timerRunning) {
            clearInterval(intervalId);
            timerRunning = false;
            startButton.textContent = "Start";
        }
    }

    function startBreak() {
        // Set break or long break based on your conditions
        if (timerBreak) {
            time = timerBreak * 60;
        } else {
            time = longBreak * 60;
        }
        timeBreak = !timeBreak;
        startButton.textContent = "Start";
    }

    function resetTimer() {
        time = minutes * 60;
        startButton.textContent = "Start";
    }

    startButton.addEventListener("click", startTimer);
}

document.addEventListener("DOMContentLoaded", main);
