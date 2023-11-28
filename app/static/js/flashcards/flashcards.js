function main() {
    // Default page
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    var flashcardsDiv = document.getElementById("flashcards");
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");
    const flashcardButtonsDiv = document.getElementsByClassName("flashcard-buttons");

    const flashcardEditButton = document.querySelectorAll(".buttons-container .flashcard-buttons .edit-button");
    const flashcardDeleteButton = document.querySelectorAll(".buttons-container .flashcard-buttons .delete-button");
    var flashcardId;

    // Flashcard page
    const flashcardPage = document.getElementById("flashcard-page");
    const flashcardForm = document.getElementById("flashcard-form");
    var flashcardAnswer;

    // Flashcard feedback page
    const flashcardFeedback = document.getElementById("flashcard-feedback");
    const feedbackUserAnswer = document.getElementById("user-answer");
    const feedbackFlashcardAnswer = document.getElementById("flashcard-answer");


    flashcardsDiv.addEventListener("click", function(event) {
        const editButton = event.target.closest(".edit-button");
        const deleteButton = event.target.closest(".delete-button");

        if (editButton) {
            handleEditButtonClick(editButton.closest(".flashcard-buttons"));
        }

        if (deleteButton) {
            handleDeleteButtonClick(deleteButton.closest(".flashcard-buttons"));
        }
    });


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
}

function handleEditButtonClick(buttonsContainer) {
    console.log("Edit button clicked. Buttons container:", buttonsContainer);

    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');
    console.log("List item:", listItem);

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");
        console.log("Flashcard ID element:", flashcardIdElement);

        if (flashcardIdElement) {
            const flashcardId = flashcardIdElement.textContent.trim();
            console.log("Edit button clicked for flashcard ID:", flashcardId);
        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}


function handleDeleteButtonClick(buttonsContainer) {
    console.log("Delete button clicked. Buttons container:", buttonsContainer);

    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    console.log("List item:", listItem);

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");
        console.log("Flashcard ID element:", flashcardIdElement);

        if (flashcardIdElement) {
            const flashcardId = flashcardIdElement.textContent.trim();
            console.log("Delete button clicked for flashcard ID:", flashcardId);
        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

document.addEventListener("DOMContentLoaded", main);
