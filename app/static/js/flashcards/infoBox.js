const infoBoxVarObject = (function() {
    const flashcardsDiv = document.getElementById("flashcards");
    const infoBoxDialog = document.getElementById("infobox-dialog");
    const infoBoxCloseButton = document.getElementById("infobox-close-button");
    var currentFlashcardId;
    var hasInfoBtnBeenClicked = false;

    return {
        flashcardsDiv: flashcardsDiv,
        infoBoxDialog: infoBoxDialog,
        infoBoxCloseButton: infoBoxCloseButton,
        currentFlashcardId: currentFlashcardId,
        hasInfoBtnBeenClicked: hasInfoBtnBeenClicked
    }
})();

function init() {
    infoBoxVarObject.flashcardsDiv.addEventListener("click", (event) => displayInfoDialog(event));
    infoBoxVarObject.infoBoxCloseButton.addEventListener("click", (event) => hideInfoDialog(event));
}

function displayInfoDialog(event) {
    event.preventDefault();
    const infoBoxButton = event.target.closest(".info-box-button");

    if (!infoBoxVarObject.hasInfoBtnBeenClicked) {
        infoBoxVarObject.hasInfoBtnBeenClicked = true;
    } else {
        infoBoxVarObject.hasInfoBtnBeenClicked = false;
    }

    if (infoBoxButton && infoBoxVarObject.hasInfoBtnBeenClicked) {
        const buttonsContainer = infoBoxButton.closest(".flashcard-buttons");
        handleInfoBoxDisplay(buttonsContainer);
        infoBoxVarObject.infoBoxDialog.style.display = "block";
    } else {
        hideInfoDialog();
    }
}

function hideInfoDialog() {
    infoBoxVarObject.hasInfoBtnBeenClicked = false;
    infoBoxVarObject.infoBoxDialog.style.display = "none";
}

function handleInfoBoxDisplay(buttonsContainer) {
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");

        if (flashcardIdElement) {
            infoBoxVarObject.currentFlashcardId = flashcardIdElement.textContent.trim();
        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

document.addEventListener("DOMContentLoaded", init);
