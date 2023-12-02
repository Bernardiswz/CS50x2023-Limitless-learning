import * as editFlashcard from "./editFlashcard.js";
import * as deleteFlashcard from "./deleteFlashcard.js";


var variables = (function() {
    // Main page variables
    const flashcardsDiv = document.getElementById("flashcards");

    // Flashcard edit variables
    const editDialog = editFlashcard.variables.editFlashcardDialog;
    const editDialogCloseButton = editFlashcard.variables.editFlashcardCloseButton;

    // Flashcard delete variables
    const deleteDialog = deleteFlashcard.deleteFlashcardDialog;
    const deleteDialogCloseButton = deleteFlashcard.deleteFlashcardCloseButton;
    const confirmDeleteButton = deleteFlashcard.confirmDeleteButton;

    return {
        flashcardsDiv: flashcardsDiv,
        editDialog: editDialog,
        editDialogCloseButton: editDialogCloseButton,
        deleteDialog: deleteDialog,
        deleteDialogCloseButton: deleteDialogCloseButton,
        confirmDeleteButton: confirmDeleteButton
    }
});

function init() {
    // Event listeners for edit
    variables.flashcardsDiv.addEventListener("click", (event) => displayOptions(event));
    variables.editDialogCloseButton.addEventListener("click", (event) => editFlashcard.closeDialog(event));

    // Event listeners for deletion
    variables.deleteDialogCloseButton.addEventListener("click", deleteFlashcard.handleDeleteCloseButton);
    variables.confirmDeleteButton.addEventListener("click", (event) => deleteFlashcard.confirmDeleteButton(event));

}

function displayOptions(event) {
    event.preventDefault();

    const editButton = event.target.closest(".edit-button");
    const deleteButton = event.target.closest(".delete-button");

    if (editButton) {
        editFlashcard.handleEditButtonClick(editButton.closest(".flashcard-buttons"));
    }

    if (deleteButton) {
        deleteFlashcard.handleDeleteButtonClick(deleteButton.closest(".flashcard-buttons"));
    }
}

document.addEventListener("DOMContentLoaded", init);
