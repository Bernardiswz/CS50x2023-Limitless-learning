const CreateFlashcardsModule = (function() {
    const createFlashcardsVariablesObject = {
        maxInputLength: 300,
        createFlashcardDiv: document.getElementById("add-button-div"),
        createFlashcardButton: document.getElementById("create-flashcard-button"),
        flashcardDialog: document.getElementById("new-flashcard-dialog"),
        dialogOverlay: document.getElementById("dialog-overlay"),
        closeDialogButton: document.getElementById("close-new-flashcard-button"),
        flashcardsDiv: document.getElementById("flashcards"),
        noFlashcardsDiv: document.getElementById("no-flashcards-div"),
        topicInput: document.getElementById("topic-input"),
        questionInput: document.getElementById("question-input"),
        answerInput: document.getElementById("answer-input"),
        dialogVisible: false,
        flashcardsContainer: document.getElementById("flashcards")
    };

    function initCreateFlashcards() {
        createFlashcardsVariablesObject.createFlashcardButton.addEventListener("click", toggleDialog);
        createFlashcardsVariablesObject.closeDialogButton.addEventListener("click", applyValidation);
    }

    function toggleDialog() {
        if (createFlashcardsVariablesObject.dialogVisible) {
            hideDialog();
        } else {
            createFlashcardsVariablesObject.dialogOverlay.style.display = "block";
            createFlashcardsVariablesObject.flashcardDialog.style.display = "block";
            createFlashcardsVariablesObject.dialogVisible = true;
        }
    }

    function hideDialog() {
        createFlashcardsVariablesObject.dialogOverlay.style.display = "none"; 
        createFlashcardsVariablesObject.flashcardDialog.style.display = "none";
    }

    function applyValidation(event) {
        event.preventDefault();
        
        userInputs = validateInputs();

        if (userInputs) {
            createFlashcardOnServer(userInputs);
        }

        createFlashcardsVariablesObject.dialogVisible = false;
        hideDialog();
    }

    function validateInputs() {
        inputs = document.querySelectorAll("#new-flashcard-dialog input");
        userInputValues = [];

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if (input.value.length > createFlashcardOnServer.maxInputLength) {
                alert("Maximum 300 characters input length exceeded.");
                return false;
            } else if (input.value.trim() === "") {
                return false;
            }

            userInputValues.push(input.value);
        }

        return userInputValues;
    }

    function createFlashcardOnServer(flashcard) {
        topic = flashcard[0];
        question = flashcard[1];
        answer = flashcard[2];

        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "createFlashcard",
                topic: topic,
                question: question,
                answer: answer
            },
            success: function(data) {
                insertCreatedFlashcard(data);
            },
            error: function(error) {
                console.log(error);
                alert("Error updating preferences");
            }
        });
    }


    function insertCreatedFlashcard(data) {
        var ulElements = createFlashcardsVariablesObject.flashcardsDiv.querySelectorAll("ul");

        if (ulElements.length === 0) {
            createFlashcardsVariablesObject.noFlashcardsDiv.style.display = "none";
        }
    
        const newFlashcard = document.createElement("ul");
        newFlashcard.classList.add("list-group", "buttons");

        newFlashcard.innerHTML = `
            <div class="flashcard-buttons">
                <button class="edit-button" type="button">
                    <img class="edit-icon" src="../static/images/edit-icon.png">
                </button>
                
                <button class="delete-button">
                    <img class="delete-icon" src="../static/images/delete-icon.png"> 
                </button>

                <button class="info-box-button" type="button">
                    <img class="info-box-icon" src="../static/images/info-icon.jpg">
                </button>
            </div>

            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start buttons">
                <div class="flashcard-id" style="display: none;">${data.createdFlashcard.flashcard_id}</div>
                <div class="flashcard-answer" style="display: none;">${data.createdFlashcard.answer}</div>
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1 flashcard-topic">${data.createdFlashcard.topic}</p>
                    <small class="time-ago">Last visited ${data.createdFlashcard.time_ago} days ago</small>
                </div>
                <h4 class="mb-1 flashcard-question">${data.createdFlashcard.question}</h4>
                <small class="timestamp">${data.createdFlashcard.timestamp}</small>
            </a>
        `;
        
        createFlashcardsVariablesObject.flashcardsContainer.appendChild(newFlashcard);
    }

    return {
        initCreateFlashcards: initCreateFlashcards
    };
})();
