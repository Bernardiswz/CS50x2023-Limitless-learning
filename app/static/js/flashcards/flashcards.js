function main() {
    // Default page
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    var flashcardsDiv = document.getElementById("flashcards");
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");
    var flashcardId;

    // Flashcard settings
    const editFlashcardDialog = document.getElementById("edit-flashcard-dialog");
    const editFlashcardCloseButton = document.getElementById("edit-flashcard-close-button");
    const dialogOverlay = document.getElementById("dialog-overlay");

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

    var flashcardIdElement;

    editFlashcardCloseButton.addEventListener("click", function(event) {
        event.preventDefault();

        editFlashcardDialog.style.display = "none";
        dialogOverlay.style.display = "none";

        var editFlashcardTopic = document.getElementById("edit-topic-input").value;
        var editFlashcardQuestion = document.getElementById("edit-question-input").value;
        var editFlashcardAnswer = document.getElementById("edit-answer-input").value;
        var editFlashcardId = flashcardIdElement.textContent.trim();

        editFlashcardOnServer(editFlashcardId, editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);
    });
    
    function handleEditButtonClick(buttonsContainer) {
        editFlashcardDialog.style.display = "block";
        dialogOverlay.style.display = "block";

        // Try to find the .list-group-item element within the parent of buttonsContainer
        const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');
        console.log("List item:", listItem);

        if (listItem) {
            flashcardIdElement = listItem.querySelector(".flashcard-id");
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

    function editFlashcardOnServer(editFlashcardId, topic, question, answer) {
        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "editFlashcard",
                flashcardId: editFlashcardId,
                topic: topic,
                question: question,
                answer: answer
            },
            success: function(data) {
                var updatedFlashcardId = data.updatedFlashcardId;
                var updatedTopic = data.updatedTopic;
                var updatedQuestion = data.updatedQuestion;
                var updatedAnswer = data.updatedAnswer;

                updateFlashcardElement(updatedFlashcardId, updatedTopic, updatedQuestion, updatedAnswer);
            },
            error: function(error) {
                console.log(error);
                alert("Error updating flashcard.");
            }
        });
    }

    function updateFlashcardElement(updatedFlashcardId, topic, question, answer) {
        var flashcardIdSelector = `.list-group-item .flashcard-id:contains("${updatedFlashcardId}")`;
        var anchorElement = $(flashcardIdSelector).filter(function() {
            return $(this).text() === updatedFlashcardId;
        });
    
        if (anchorElement.length > 0) {
            var parentAElement = anchorElement.closest(".list-group-item");

            parentAElement.find(".flashcard-topic").text(topic);
            parentAElement.find(".flashcard-question").text(question);
            parentAElement.find(".answer").text(answer);

            console.log(parentAElement);
        }
    }
    
}

document.addEventListener("DOMContentLoaded", main);
