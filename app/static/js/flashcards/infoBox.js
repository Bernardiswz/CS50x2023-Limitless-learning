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
        hasInfoBtnBeenClicked: hasInfoBtnBeenClicked,
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
            populateInfoboxDialog(data.flashcardRatingsCount);
            console.log(data.mostRecentRating);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function populateInfoboxDialog(ratings) {
    for (const difficulty in ratings) {
        if (ratings.hasOwnProperty(difficulty)) {
            const count = ratings[difficulty];
            const element = document.getElementById(`${difficulty}-count`);
            if (element) {
                element.textContent = count;
            }
        }
    }
}

function highlightLastRating(rating) {
    const lastRatingLabel = document.getElementById(`${rating}-count`);

    if (lastRatingLabel) {
        
    }
}

document.addEventListener("DOMContentLoaded", init);
