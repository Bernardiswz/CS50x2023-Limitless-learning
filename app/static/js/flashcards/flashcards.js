function main() {
    // Default page
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    // var flashcardsDiv = document.getElementById("flashcards");
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");
    var flashcardId;

    // Flashcard page
    const flashcardPage = document.getElementById("flashcard-page");
    const flashcardForm = document.getElementById("flashcard-form");
    var flashcardAnswer;

    // Flashcard feedback page
    const flashcardFeedback = document.getElementById("flashcard-feedback");
    const feedbackUserAnswer = document.getElementById("user-answer");
    const feedbackFlashcardAnswer = document.getElementById("flashcard-answer");

    // Handle default page flashcard selecting
    flashcards.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            flashcardId = event.currentTarget.parentElement.querySelector(".flashcard-id") ?
                event.currentTarget.parentElement.querySelector(".flashcard-id").textContent : "Id not found";

            var topic = event.currentTarget.querySelector("p.mb-1") ? event.currentTarget.querySelector("p.mb-1").textContent : "Topic not found";
            var question = event.currentTarget.querySelector("h4.mb-1") ? event.currentTarget.querySelector("h4.mb-1").textContent : "Question not found";
            var answer = event.currentTarget.parentElement.querySelector(".answer") ? event.currentTarget.parentElement.querySelector(".answer").textContent : "Answer not found";

            flashcardTopic.textContent = topic;
            flashcardQuestion.textContent = question;
            flashcardAnswer = answer; // Update the global variable with the current flashcard's answer

            flashcardsDiv.style.display = "none";
            flashcardPage.style.display = "block";
        });
    });

    // Handle flashcard testing submit
    flashcardForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const formAnswer = flashcardForm.answer.value;
        console.log(formAnswer);

        flashcardPage.style.display = "none";

        feedbackUserAnswer.textContent = formAnswer;
        feedbackFlashcardAnswer.textContent = flashcardAnswer;

        flashcardFeedback.style.display = "block";
    });

    // Handle flashcard feedback
    var feedbackButtons = document.querySelectorAll("#buttons-div button");

    feedbackButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            var buttonValue = event.target.value;

            $.ajax({
                type: "POST",
                url: "/update_data",
                data: {
                    operation: "flashcardFeedback",
                    buttonValue: buttonValue,
                    flashcardId: flashcardId
                }
            });

            flashcardFeedback.style.display = "none";
            flashcardsDiv.style.display = "flex";

        });
    });

    var flashcardIdElement;

    // Delete flashcard confirmation dialog
    const deleteFlashcardDialog = document.getElementById("delete-flashcard-dialog");
    const deleteFlashcardCloseButton = document.getElementById("delete-flashcard-close-button");
    const confirmDeleteButton = document.getElementById("confirm-delete-button");

    confirmDeleteButton.addEventListener("click", function(event) {
        event.preventDefault();
        deleteFlashcardDialog.style.display = "none";
        dialogOverlay.style.display = "none";
        
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
    });

    deleteFlashcardCloseButton.addEventListener("click", function(event) {
        event.preventDefault();
        deleteFlashcardDialog.style.display = "none";
        dialogOverlay.style.display = "none";
    });

    /* Helper functions */
    function handleDeleteButtonClick(buttonsContainer) {
        deleteFlashcardDialog.style.display = "block";
        dialogOverlay.style.display = "block";
    }
    
    function deleteFlashcardOnServer(deleteFlashcardId) {
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
    
    function deleteFlashcardElementOnPage(toDeleteFlashcardId) {
        var flashcardIdSelect = `.list-group-item .flashcard-id:contains("${toDeleteFlashcardId}")`;
        var anchorElement = $(flashcardIdSelect).filter(function() {
            return $(this).text() === toDeleteFlashcardId;
        });
    
        if (anchorElement.length > 0) {
            flashcardIdSelect.remove();
        }
    }
}

document.addEventListener("DOMContentLoaded", main);
