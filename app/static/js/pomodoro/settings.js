function main() {
    const settingsButton = document.getElementById("settings-button");
    const settingsDialog = document.getElementById("settings-dialog");
    const closeButton = document.getElementById("close-button");
    const settingsOverlay = document.getElementById("dialog-overlay");
    const inputContainer = document.getElementById("inputs");
    let dialogVisible = false;

    settingsButton.addEventListener("click", toggleDialog);
    closeButton.addEventListener("click", buttonEventListeners);

    function checkInputs() {
        const inputs = inputContainer.querySelectorAll("input");

        // Check if all inputs have a integer value greater than 0, 
        return Array.from(inputs).every(input => {
            const value = parseInt(input.value);
            return !isNaN(value) && value > 0;
        });

    }

    function toggleDialog(event) {
        if (dialogVisible) {
            hideDialog();
        } else {
            settingsDialog.style.display = "block";
            settingsOverlay.style.display = "block";
            dialogVisible = true;
        }
    }

    function hideDialog() {
        settingsDialog.style.display = "none";
        settingsOverlay.style.display = "none";
        dialogVisible = false;
    }

    function updatePreferencesOnServer() {
        var minutes = $("#minutes-input").val();
        var timerBreak = $("#break-input").val();
        var longBreak = $("#long-break-input").val();

        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "updatePomodoro",
                minutes: minutes,
                timerBreak: timerBreak,
                longBreak: longBreak
            },
            success: function(data) {
                console.log("Preferences updated");
            },
            error: function(error) {
                console.log(error);
                alert("Error updating preferences");
            }
        });
    }

    function buttonEventListeners(event) {
        if (checkInputs()) {
            hideDialog();
        }

        if (!dialogVisible) {
            updatePreferencesOnServer();
        }

        event.preventDefault();
    }
}

document.addEventListener("DOMContentLoaded", main);
