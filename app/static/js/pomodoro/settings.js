function main() {
    const settingsButton = document.getElementById("settings-button");
    const settingsDialog = document.getElementById("settings-dialog");
    const closeButton = document.getElementById("close-button");
    const settingsOverlay = document.getElementById("overlay");
    let dialogVisible = false;

    settingsButton.addEventListener("click", toggleDialog);

    function toggleDialog(event) {
        if (dialogVisible) {
            hideDialog()
        } else {
            settingsDialog.style.display = "block";
            settingsOverlay.style.display = "block";
            dialogVisible = true;

            closeButton.addEventListener("click", buttonEventListeners);
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
            url: "/pomodoro",
            data: {
                minutes: minutes,
                break: timerBreak,
                long_break: longBreak
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
        hideDialog();

        if (!dialogVisible) {
            updatePreferencesOnServer();
        }

        event.preventDefault();
    }
}

document.addEventListener("DOMContentLoaded", main);
