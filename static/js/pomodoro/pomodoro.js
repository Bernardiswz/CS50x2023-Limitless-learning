/* Adding functionality to the Pomodoro timer page */

function main() {
    // Retrieving the values of the respective elements of the page
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const buttonSound = document.getElementById("button-sound");
    const timeupSound = document.getElementById("timeup-sound");
    const minutes = 25; // Asigning the default value to the timer according to Pomodoro technique

    // Initializing variables of time and to dynamism between the on and off states of the button
    let time = minutes * 60;
    let intervalId;
    let timerRunning = false;
    let waiting = false;

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

    //   function restTimer() {
    //     if (time < 0) {
    //         clearInterval(intervalId);
    //         timerRunning = false;
    //         timeupSound.play();

    //         time = 
    //     }
    //   }
      
    startButton.addEventListener("click", startTimer);
}

document.addEventListener("DOMContentLoaded", main);
