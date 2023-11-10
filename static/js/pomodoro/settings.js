function main() {
    const settingsButton = document.getElementById("settings-button");
    const settingsDialog = document.getElementById("settings-dialog");
    const settingsOverlay = document.getElementById("overlay");

    let dialogVisible = false;

    settingsButton.addEventListener("click", toggleDialog);

    function toggleDialog(event) {
        if (dialogVisible) {
            settingsDialog.style.display = "none";
            settingsOverlay.style.display = "none";
            dialogVisible = false;
        } else {
            settingsDialog.style.display = "block";
            settingsOverlay.style.display = "block";
            dialogVisible = true;
        }
    }
}

document.addEventListener("DOMContentLoaded", main);
