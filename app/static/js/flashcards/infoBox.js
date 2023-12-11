const InfoBoxModule = (function() {
    const infoBoxVarObject = {
        flashcardsDiv: document.getElementById("flashcards"),
        infoBoxDialog: document.getElementById("infobox-dialog"),
        dialogOverlay: document.getElementById("dialog-overlay"),
        infoBoxCloseButton: document.getElementById("infobox-close-button"),
        currentFlashcardId: undefined,
        hasInfoBtnBeenClicked: false,
    };

    function initInfoBox() {
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
            infoBoxVarObject.dialogOverlay.style.display = "block";
        } else {
            hideInfoDialog();
        }
    }

    function hideInfoDialog() {
        infoBoxVarObject.hasInfoBtnBeenClicked = false;
        infoBoxVarObject.infoBoxDialog.style.display = "none";
        infoBoxVarObject.dialogOverlay.style.display = "none";
    }

    function handleInfoBoxDisplay(buttonsContainer) {
        const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

        if (listItem) {
            const flashcardIdElement = listItem.querySelector(".flashcard-id");

            if (flashcardIdElement) {
                infoBoxVarObject.currentFlashcardId = flashcardIdElement.textContent.trim();
                getFlashcardRatings(infoBoxVarObject.currentFlashcardId);
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

    return {
        initInfoBox: initInfoBox
    };
})();
