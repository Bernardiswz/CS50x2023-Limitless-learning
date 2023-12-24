const DeleteFlashcardsModule = (function() {
    const deleteVariablesObject = {
        flashcardsDiv: document.getElementById("flashcards"),
        deleteFlashcardDialog: document.getElementById("delete-flashcard-dialog"),
        deleteFlashcardCloseButton: document.getElementById("delete-flashcard-close-button"),
        confirmDeleteButton: document.getElementById("confirm-delete-button"),
        dialogOverlay: document.getElementById("dialog-overlay"),
        buttonsContainer: undefined
    };

    function initDeleteFlashcards() {
        deleteVariablesObject.flashcardsDiv.addEventListener("click", (event) => displayDeleteOption(event));
        deleteVariablesObject.deleteFlashcardCloseButton.addEventListener("click", handleDeleteCloseButton);
        deleteVariablesObject.confirmDeleteButton.addEventListener("click", (event) => handleConfirmDelete(event));
    }

    function displayDeleteOption(event) {
        event.preventDefault();
        const deleteButton = event.target.closest(".delete-button");

        if (deleteButton) {
            handleDeleteButtonClick(deleteButton.closest(".flashcard-buttons"));
        }
    }

    function handleDeleteButtonClick(buttonsContainer) {
        deleteVariablesObject.deleteFlashcardDialog.style.display = "block";
        deleteVariablesObject.dialogOverlay.style.display = "block";
        deleteVariablesObject.buttonsContainer = buttonsContainer;
    }

    function handleDeleteCloseButton() {
        deleteVariablesObject.deleteFlashcardDialog.style.display = "none";
        deleteVariablesObject.dialogOverlay.style.display = "none";
    }

    function handleConfirmDelete(event) {
        event.preventDefault();
        deleteVariablesObject.deleteFlashcardDialog.style.display = "none";
        deleteVariablesObject.dialogOverlay.style.display = "none";
        
        // Try to find the .list-group-item element within the parent of buttonsContainer
        const listItem = deleteVariablesObject.buttonsContainer.closest('.buttons').querySelector('.list-group-item');

        if (listItem) {
            const flashcardIdElement = listItem.querySelector(".flashcard-id");

            if (flashcardIdElement) {
                const flashcardId = flashcardIdElement.textContent.trim();
                deleteFlashcardOnServer(flashcardId);

            } else {
                console.error("Error: Flashcard ID element not found!");
            }
        } else {
            console.error("Error: List item not found!");
        }
    }

    function deleteFlashcardOnServer(deleteFlashcardId) {
        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "deleteFlashcard",
                flashcardId: deleteFlashcardId,
            },
            success: function(data) {
                const flashcardToDelete = data.flashcardToDeleteId;
                deleteFlashcardElementOnPage(flashcardToDelete);
            },
            error: function(error) {
                console.log(error);
                alert("Error updating flashcard.");
            }
        });
    }

    function deleteFlashcardElementOnPage(toDeleteFlashcardId) {
        var flashcardIdSelector = `.list-group-item .flashcard-id`;
        var anchorElements = $(flashcardIdSelector).filter(function() {
            return $(this).text().trim() === toDeleteFlashcardId;
        });

        if (anchorElements.length > 0) {
            anchorElements.closest("ul").remove();
        }
    }

    return {
        initDeleteFlashcards: initDeleteFlashcards
    };
})();
