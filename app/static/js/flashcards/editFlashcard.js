const EditFlashcardsModule = (function() {
    const editVariablesObject = {
        flashcardsDiv: document.getElementById("flashcards"),
        editFlashcardDialog: document.getElementById("edit-flashcard-dialog"),
        editFlashcardCloseButton: document.getElementById("edit-flashcard-close-button"),
        dialogOverlay: document.getElementById("dialog-overlay"),
        maxInputLength: 300,
        currentFlashcardTopic: document.getElementById("edit-topic-input"),
        currentFlashcardQuestion: document.getElementById("edit-question-input"),
        currentFlashcardAnswer: document.getElementById("edit-answer-input"),
        currentFlashcardId: undefined
    };

    function initEditFlashcard() {
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
            editVariablesObject.currentFlashcardTopic.value = listItem.querySelector(".flashcard-topic").textContent;
            editVariablesObject.currentFlashcardQuestion.value = listItem.querySelector(".flashcard-question").textContent;
            editVariablesObject.currentFlashcardAnswer.value = listItem.querySelector(".flashcard-answer").textContent;

            if (flashcardIdElement) {
                editVariablesObject.currentFlashcardId = flashcardIdElement.textContent.trim();
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

        var editFlashcardTopic = editVariablesObject.currentFlashcardTopic.value;
        var editFlashcardQuestion = editVariablesObject.currentFlashcardQuestion.value;
        var editFlashcardAnswer = editVariablesObject.currentFlashcardAnswer.value;
        var editFlashcardId = editVariablesObject.currentFlashcardId;

        const checkUserInputs = isUserInputsValid(editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);

        if (!checkUserInputs) {
            return;
        }
        
        editFlashcardOnServer(editFlashcardId, editFlashcardTopic, editFlashcardQuestion, editFlashcardAnswer);
    }

    function isUserInputsValid(topic, question, answer) {
        const userInputs = [topic, question, answer];

        for (let i = 0; i < userInputs.length; i++) {
            if (userInputs[i].length > editVariablesObject.maxInputLength) {
                window.alert(`Maximum ${editVariablesObject.maxInputLength} characters input length exceeded.`);
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
                
                const updatedFlashcardId = editVariablesObject.currentFlashcardId;
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

    return {
        initEditFlashcard: initEditFlashcard
    };
})();
