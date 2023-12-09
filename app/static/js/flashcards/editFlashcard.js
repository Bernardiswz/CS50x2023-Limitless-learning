const EditVariablesObject = (function() {
    const flashcardsDiv = document.getElementById("flashcards");
    const editFlashcardDialog = document.getElementById("edit-flashcard-dialog");
    const editFlashcardCloseButton = document.getElementById("edit-flashcard-close-button");
    const dialogOverlay = document.getElementById("dialog-overlay");
    const maxInputLength = 300;
    const currentFlashcardTopic = document.getElementById("edit-topic-input");
    const currentFlashcardQuestion = document.getElementById("edit-question-input");
    const currentFlashcardAnswer = document.getElementById("edit-answer-input");
    var currentFlashcardId;

    return {
        flashcardsDiv: flashcardsDiv,
        editFlashcardDialog: editFlashcardDialog,
        editFlashcardCloseButton: editFlashcardCloseButton,
        dialogOverlay: dialogOverlay,
        maxInputLength: maxInputLength,
        currentFlashcardId: currentFlashcardId,
        currentFlashcardTopic: currentFlashcardTopic,
        currentFlashcardQuestion: currentFlashcardQuestion,
        currentFlashcardAnswer: currentFlashcardAnswer
    }
})();

function init() {
    EditVariablesObject.flashcardsDiv.addEventListener("click", (event) => displayEditOption(event));
    EditVariablesObject.editFlashcardCloseButton.addEventListener("click", (event) => closeEditDialog(event));
}

function displayEditOption(event) {
    event.preventDefault();
    const editButton = event.target.closest(".edit-button");

    if (editButton) {
        handleEditButtonClick(editButton.closest(".flashcard-buttons"));
    }
}

function handleEditButtonClick(buttonsContainer) {
    EditVariablesObject.editFlashcardDialog.style.display = "block";
    EditVariablesObject.dialogOverlay.style.display = "block";

    // Try to find the .list-group-item element within the parent of buttonsContainer
    const listItem = buttonsContainer.closest('.buttons').querySelector('.list-group-item');

    if (listItem) {
        const flashcardIdElement = listItem.querySelector(".flashcard-id");
        EditVariablesObject.currentFlashcardTopic.value = listItem.querySelector(".flashcard-topic").textContent;
        EditVariablesObject.currentFlashcardQuestion.value = listItem.querySelector(".flashcard-question").textContent;
        EditVariablesObject.currentFlashcardAnswer.value = listItem.querySelector(".flashcard-answer").textContent;

        if (flashcardIdElement) {
            EditVariablesObject.currentFlashcardId = flashcardIdElement.textContent.trim();
        } else {
            console.error("Error: Flashcard ID element not found!");
        }
    } else {
        console.error("Error: List item not found!");
    }
}

function closeEditDialog(event) {
    event.preventDefault();

    EditVariablesObject.editFlashcardDialog.style.display = "none";
    EditVariablesObject.dialogOverlay.style.display = "none";

    var editFlashcardTopic = EditVariablesObject.currentFlashcardTopic.value;
    var editFlashcardQuestion = EditVariablesObject.currentFlashcardQuestion.value;
    var editFlashcardAnswer = EditVariablesObject.currentFlashcardAnswer.value;
    var editFlashcardId = EditVariablesObject.currentFlashcardId;

    const checkUserInputs = isUserInputsValid(editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);

    if (!checkUserInputs) {
        return;
    }
    
    editFlashcardOnServer(editFlashcardId, editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);
}

function isUserInputsValid(topic, question, answer) {
    const userInputs = [topic, question, answer];

    for (let i = 0; i < userInputs.length; i++) {
        if (userInputs[i].length > EditVariablesObject.maxInputLength) {
            window.alert(`Maximum ${EditVariablesObject.maxInputLength} characters input length exceeded.`);
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
            data = data.updatedFlashcardData;

            // Assign keys to the object passed to the updateFlashcardElement on page, even if falsy
            
            const updatedFlashcardId = EditVariablesObject.currentFlashcardId;
            const argumentDataKeys = ["topic", "question", "answer"];
            const validObject = {}

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    validObject[key] = data[key];
                }
            }

            for (const keyName of argumentDataKeys) {
                if (!validObject.hasOwnProperty(keyName)) {
                    validObject[keyName] = "";
                }
            }

            console.log(validObject)

            updateFlashcardElement({
                flashcardId: updatedFlashcardId,
                topic: validObject.topic,
                question: validObject.question,
                answer: validObject.answer
            });
           
        },
        error: function(error) {
            console.log(error);
            alert("Error updating flashcard.");
        }
    });
}

function updateFlashcardElement({flashcardId, topic, question, answer}) {
    const validElements = {
        flashcardId: flashcardId
    };

    const argsObject = {
        topic: topic, 
        question: question, 
        answer: answer
    };

    console.log(argsObject)

    // Retrieve the anchor element and update it dynamically according to the changes made to the flashcard
    var flashcardIdSelector = `.list-group-item .flashcard-id:contains("${validElements.flashcardId}")`;
    var anchorElement = $(flashcardIdSelector).filter(function() {
        return $(this).text() === validElements.flashcardId;
    });

    if (anchorElement.length > 0) {
        var parentAElement = anchorElement.closest(".list-group-item");

        for (const key in argsObject) {
            if (argsObject.hasOwnProperty(key) && argsObject[key] !== "") {
                parentAElement.find(`.flashcard-${key}`).text(argsObject[key]);
            }
        }
    }
}

// function updateFlashcardElementsa(updatedFlashcardId, topic, question, answer) {
//     var flashcardIdSelector = `.list-group-item .flashcard-id:contains("${updatedFlashcardId}")`;
//     var anchorElement = $(flashcardIdSelector).filter(function() {
//         return $(this).text() === updatedFlashcardId;
//     });

//     if (anchorElement.length > 0) {
//         var parentAElement = anchorElement.closest(".list-group-item");

//         parentAElement.find(".flashcard-topic").text(topic);
//         parentAElement.find(".flashcard-question").text(question);
//         parentAElement.find(".flashcard-answer").text(answer);
//     }
// }

document.addEventListener("DOMContentLoaded", init);
