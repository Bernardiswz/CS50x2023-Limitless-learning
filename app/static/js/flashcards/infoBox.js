const InfoBoxVarObject = (function() {
    const flashcardsDiv = document.getElementById("flashcards");
    const infoBoxDialog = document.getElementById("infobox-dialog");
    const dialogOverlay = document.getElementById("dialog-overlay");
    const infoBoxCloseButton = document.getElementById("infobox-close-button");
    var currentFlashcardId;
    var hasInfoBtnBeenClicked = false;

    return {
        flashcardsDiv: flashcardsDiv,
        infoBoxDialog: infoBoxDialog,
        dialogOverlay: dialogOverlay,
        infoBoxCloseButton: infoBoxCloseButton,
        currentFlashcardId: currentFlashcardId,
        hasInfoBtnBeenClicked: hasInfoBtnBeenClicked
    }
})();

function init() {
    InfoBoxVarObject.flashcardsDiv.addEventListener("click", (event) => displayInfoDialog(event));
    InfoBoxVarObject.infoBoxCloseButton.addEventListener("click", (event) => hideInfoDialog(event));
}

function displayInfoDialog(event) {
    event.preventDefault();
    const infoBoxButton = event.target.closest(".info-box-button");

    if (!InfoBoxVarObject.hasInfoBtnBeenClicked) {
        InfoBoxVarObject.hasInfoBtnBeenClicked = true;
    } else {
        InfoBoxVarObject.hasInfoBtnBeenClicked = false;
    }

    if (infoBoxButton && InfoBoxVarObject.hasInfoBtnBeenClicked) {
        const buttonsContainer = infoBoxButton.closest(".flashcard-buttons");
        handleInfoBoxDisplay(buttonsContainer);
        InfoBoxVarObject.infoBoxDialog.style.display = "block";
        InfoBoxVarObject.dialogOverlay.style.display = "block";
    } else {
        hideInfoDialog();
    }
}

function hideInfoDialog() {
    InfoBoxVarObject.hasInfoBtnBeenClicked = false;
    InfoBoxVarObject.infoBoxDialog.style.display = "none";
    InfoBoxVarObject.dialogOverlay.style.display = "none";
}

function handleInfoBoxDisplay(buttonsContainer) {
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");

        if (flashcardIdElement) {
            InfoBoxVarObject.currentFlashcardId = flashcardIdElement.textContent.trim();
            getFlashcardRatings(InfoBoxVarObject.currentFlashcardId);
        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

function getFlashcardRatings(flashcardId) {
    $.ajax({
        type: "POST",
        url: "/update_data",
        data: {
            operation: "getFlashcardRatings",
            flashcardId: flashcardId
        },
        success: function(data) {
            console.log(data.flashcardRatingsCount)
            // populateInfoboxDialog(data.flashcardRatings);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function populateInfoboxDialog(ratings) {
    for (let i = 0; i < ratings.length; i++) {
        const ratingsOnDialog = document.createElement("p");
        // ratingsOnDialog.classList.add

        ratingsOnDialog.innerHTML = Object.values(ratings[i]);

        InfoBoxVarObject.infoBoxDialog.appendChild(ratingsOnDialog);
    }

}

document.addEventListener("DOMContentLoaded", init);
