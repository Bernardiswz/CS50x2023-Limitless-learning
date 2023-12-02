export var variables = (function() {
    const deleteFlashcardDialog = document.getElementById("delete-flashcard-dialog");
    const deleteFlashcardCloseButton = document.getElementById("delete-flashcard-close-button");
    const confirmDeleteButton = document.getElementById("confirm-delete-button");
    const dialogOverlay = document.getElementById("dialog-overlay");

    return {
        deleteFlashcardDialog: deleteFlashcardDialog,
        deleteFlashcardCloseButton: deleteFlashcardCloseButton,
        confirmDeleteButton: confirmDeleteButton,
        dialogOverlay: dialogOverlay
    }
})

export function handleConfirmDelete(event) {
    event.preventDefault();
    variables.deleteFlashcardDialog.style.display = "none";
    variables.dialogOverlay.style.display = "none";
    
    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

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

export function handleDeleteCloseButton() {
    variables.deleteFlashcardDialog.style.display = "none";
    variables.dialogOverlay.style.display = "none";
}

export function handleDeleteButtonClick() {
    variables.deleteFlashcardDialog.style.display = "block";
    variables.dialogOverlay.style.display = "block";
}

export function deleteFlashcardOnServer(deleteFlashcardId) {
    $.ajax({
        type: "POST",
        url: "/update_data",
        data: {
            operation: "deleteFlashcard",
            flashcardId: deleteFlashcardId,
        },
        success: function(data) {
            flashcardToDelete = data.flashcardToDeleteId;

            deleteFlashcardElementOnPage(flashcardToDelete);
        },
        error: function(error) {
            console.log(error);
            alert("Error updating flashcard.");
        }
    });
}

export function deleteFlashcardElementOnPage(toDeleteFlashcardId) {
    var flashcardIdSelect = `.list-group-item .flashcard-id:contains("${toDeleteFlashcardId}")`;
    var anchorElement = $(flashcardIdSelect).filter(function() {
        return $(this).text() === toDeleteFlashcardId;
    });

    if (anchorElement.length > 0) {
        flashcardIdSelect.remove();
    }
}
