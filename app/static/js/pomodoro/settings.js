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

            closeButton.addEventListener("click", hideDialog);
        }
    }

    function hideDialog() {
        settingsDialog.style.display = "none";
        settingsOverlay.style.display = "none";
        dialogVisible = false;
    }
}

document.addEventListener("DOMContentLoaded", main);
