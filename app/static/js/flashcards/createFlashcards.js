function main() {
    const maxInputLength = 300;
    const createFlashcardDiv = document.getElementById("add-button-div");
    const createFlashcardButton = document.getElementById("create-flashcard-button");
    const flashcardDialog = document.getElementById("new-flashcard-dialog");
    const dialogOverlay = document.getElementById("dialog-overlay");
    const closeDialogButton = document.getElementById("close-button");

    const topicInput = document.getElementById("topic-input");
    const questionInput = document.getElementById("question-input");
    const answerInput = document.getElementById("answer-input");
    let dialogVisible = false;

    const flashcardsContainer = document.getElementById("flashcards");

    createFlashcardButton.addEventListener("click", toggleDialog);
    closeDialogButton.addEventListener("click", applyValidation);
    
    function toggleDialog(event) {
        if (dialogVisible) {
            hideDialog();
        } else {
            dialogOverlay.style.display = "block";
            flashcardDialog.style.display = "block";
            dialogVisible = true;
        }
    }

    function hideDialog() {
        dialogOverlay.style.display = "none"; 
        flashcardDialog.style.display = "none";
    }

    function applyValidation(event) {
        event.preventDefault();
        
        userInputs = validateInputs();

        if (userInputs) {
            createFlashcardOnServer(userInputs);
        }

        dialogVisible = false;
        hideDialog();
    }

    function validateInputs() {
        inputs = document.querySelectorAll("#new-flashcard-dialog input");
        userInputValues = [];
    
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
    
            if (input.value.length > maxInputLength) {
                alert("Maximum 200 characters input length exceeded.");
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

    // function queryFlashcard()

    function insertCreatedFlashcard(data) {
        console.log(typeof(data));
        console.log(data);

        const newFlashcard = document.createElement("ul");
        newFlashcard.classList.add("list-group", "buttons");
        newFlashcard.classList.add("list-group", "buttons");

        newFlashcard.innerHTML = `
            <div class="flashcard-id" style="display: none;">${data.createdFlashcard.flashcard_id}</div>
            <div class="answer" style="display: none;">${data.createdFlashcard.answer}</div>
            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start buttons">
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1">${data.createdFlashcard.topic}</p>
                    <small>Last visited ${data.createdFlashcard.time_ago} days ago</small>
                </div>
                <h4 class="mb-1">${data.createdFlashcard.question}</h4>
                <small>${data.createdFlashcard.timestamp}</small>
            </a>
        `;
        
        flashcardsContainer.insertBefore(newFlashcard, createFlashcardDiv);
    }
}

document.addEventListener("DOMContentLoaded", main);
