function main() {
    const createFlashcardButton = document.getElementById("create-flashcard-button");
    const flashcardDialog = document.getElementById("new-flashcard-dialog");
    const dialogOverlay = document.getElementById("dialog-overlay");
    const closeDialogButton = document.getElementById("close-button");

    createFlashcardButton.addEventListener("click", function() {
        dialogOverlay.style.display = "block";
        flashcardDialog.style.display = "block";

        closeDialogButton.addEventListener("click", function () {
            dialogOverlay.style.display = "none";
            flashcardDialog.style.display = "none";
        });
    });

}

document.addEventListener("DOMContentLoaded", main);
