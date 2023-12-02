const editVariablesObject = (function() {
    const flashcardsDiv = document.getElementById("flashcards");
    const editFlashcardDialog = document.getElementById("edit-flashcard-dialog");
    const editFlashcardCloseButton = document.getElementById("edit-flashcard-close-button");
    const dialogOverlay = document.getElementById("dialog-overlay");
    const maxInputLength = 300;
    var currentFlashcardId;

    return {
        flashcardsDiv: flashcardsDiv,
        editFlashcardDialog: editFlashcardDialog,
        editFlashcardCloseButton: editFlashcardCloseButton,
        dialogOverlay: dialogOverlay,
        maxInputLength: maxInputLength,
        currentFlashcardId: currentFlashcardId
    }
})();

function init() {
    editVariablesObject.flashcardsDiv.addEventListener("click", (event) => displayEditOption(event));
    editVariablesObject.editFlashcardCloseButton.addEventListener("click", (event) => closeEditDialog(event));
}

function displayEditOption(event) {
    event.preventDefault();
    const editButton = event.target.closest(".edit-button");

    if (editButton) {
        handleEditButtonClick(editButton.closest(".flashcard-buttons"));
    }
}

function handleEditButtonClick(buttonsContainer) {
    editVariablesObject.editFlashcardDialog.style.display = "block";
    editVariablesObject.dialogOverlay.style.display = "block";

    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");
        
        if (flashcardIdElement) {
            editVariablesObject.currentFlashcardId = flashcardIdElement.textContent.trim();
            console.log(editVariablesObject.currentFlashcardId);

        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

function closeEditDialog(event) {
    event.preventDefault();

    editVariablesObject.editFlashcardDialog.style.display = "none";
    editVariablesObject.dialogOverlay.style.display = "none";

    var editFlashcardTopic = document.getElementById("edit-topic-input").value;
    var editFlashcardQuestion = document.getElementById("edit-question-input").value;
    var editFlashcardAnswer = document.getElementById("edit-answer-input").value;
    var editFlashcardId = editVariablesObject.currentFlashcardId

    const checkUserInputs = isUserInputsValid(editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);

    if (!checkUserInputs) {
        return;
    }

    editFlashcardOnServer(editFlashcardId, editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);
}

function isUserInputsValid(topic, question, answer) {
    const userInputs = [topic, question, answer];

    for (let i = 0; i < userInputs.length; i++) {
        if (userInputs[i].length > deleteVariablesObject.maxInputLength) {
            window.alert(`Maximum ${deleteVariablesObject.maxInputLength} characters input length exceeded.`);
            return false;
        } else if (userInputs[i].trim() === "") {
            return false;
        }
    }

    return true;
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

document.addEventListener("DOMContentLoaded", init);
