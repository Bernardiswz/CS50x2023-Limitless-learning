function main() {
    const maxInputLength = 300;
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
                console.log("Preferences updated");
            },
            error: function(error) {
                console.log(error);
                alert("Error updating preferences");
            }
        });
    }

    function insertCreatedFlashcard(data) {
        const newFlashcard = document.createElement


    }
    
    

}

document.addEventListener("DOMContentLoaded", main);
