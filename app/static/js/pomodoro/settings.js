const PomodoroSettingsModule = (function() {
    const settingsElements = {
        settingsButton: document.getElementById("settings-button"),
        settingsDialog: document.getElementById("settings-dialog"),
        closeButton: document.getElementById("close-button"),
        settingsOverlay: document.getElementById("dialog-overlay"),
        inputContainer: document.getElementById("inputs"),
        dialogVisible: false
    };

    function initPomodoroSettings() {
        settingsElements.settingsButton.addEventListener("click", toggleDialog);
        settingsElements.closeButton.addEventListener("click", (event) => buttonEventListeners(event));
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

    function buttonEventListeners(event) {
        event.preventDefault();
        
        if (checkInputs()) {
            hideDialog();
        }

        if (!settingsElements.dialogVisible) {
            updatePreferencesOnServer();
        }
    }

    function updatePreferencesOnServer() {
        var minutes = $("#minutes-input").val();
        var timerBreak = $("#break-input").val();
        var longBreak = $("#long-break-input").val();
        var lbInterval = $("#lb-interval-input").val();

        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "updatePomodoro",
                minutes: minutes,
                timerBreak: timerBreak,
                longBreak: longBreak,
                lbInterval: lbInterval
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

    return {
        initPomodoroSettings: initPomodoroSettings
    };
})();
