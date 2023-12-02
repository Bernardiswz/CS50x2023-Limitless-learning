var variables = (function() {
    const editFlashcardDialog = document.getElementById("edit-flashcard-dialog");
    const editFlashcardCloseButton = document.getElementById("edit-flashcard-close-button");
    const dialogOverlay = document.getElementById("dialog-overlay");

    return {
        editFlashcardDialog: editFlashcardDialog,
        editFlashcardCloseButton: editFlashcardCloseButton,
        dialogOverlay: dialogOverlay
    }
});

function handleEditButtonClick(buttonsContainer) {
    variables.editFlashcardDialog.style.display = "block";
    variables.dialogOverlay.style.display = "block";

    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");
        
        if (flashcardIdElement) {
            const flashcardId = flashcardIdElement.textContent.trim();

        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

function closeEditDialog(event) {
    event.preventDefault();

    variables.editFlashcardDialog.style.display = "none";
    variables.dialogOverlay.style.display = "none";

    var editFlashcardTopic = document.getElementById("edit-topic-input").value;
    var editFlashcardQuestion = document.getElementById("edit-question-input").value;
    var editFlashcardAnswer = document.getElementById("edit-answer-input").value;
    var editFlashcardId = flashcardIdElement.textContent.trim();

    editFlashcardOnServer(editFlashcardId, editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);
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
    }
}
