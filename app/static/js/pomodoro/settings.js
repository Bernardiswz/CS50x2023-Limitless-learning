const settingsElements = {
    settingsButton: document.getElementById("settings-button"),
    settingsDialog: document.getElementById("settings-dialog"),
    closeButton: document.getElementById("close-button"),
    settingsOverlay: document.getElementById("dialog-overlay"),
    inputContainer: document.getElementById("inputs"),
    dialogVisible: false
};


function init() {
    settingsElements.settingsButton.addEventListener("click", toggleDialog);
    settingsElements.closeButton.addEventListener("click", buttonEventListeners);
}   

function checkInputs() {
    const inputs = settingsElements.inputContainer.querySelectorAll("input");

    // Check if all inputs have a integer value greater than 0, 
    return Array.from(inputs).every(input => {
        const value = parseInt(input.value);
        return !isNaN(value) && value > 0;
    });
}

function toggleDialog() {
    if (settingsElements.dialogVisible) {
        hideDialog();
    } else {
        settingsElements.settingsDialog.style.display = "block";
        settingsElements.settingsOverlay.style.display = "block";
        settingsElements.dialogVisible = true;
    }
}

function hideDialog() {
    settingsElements.settingsDialog.style.display = "none";
    settingsElements.settingsOverlay.style.display = "none";
    settingsElements.dialogVisible = false;
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
            var preferencesUpdateSucess = true;
        },
        error: function(error) {
            console.log(error);
            alert("Error updating preferences");
            var preferencesUpdateSucess = false;
        }
    });
}

function buttonEventListeners() {
    if (checkInputs()) {
        hideDialog();
    }

    if (!settingsElements.dialogVisible) {
        updatePreferencesOnServer();
    }
}

document.addEventListener("DOMContentLoaded", init);
