const FlashcardsModule = (function() {
    const flashcardsVariablesObject = {
        // Default page
        flashcards: document.querySelectorAll(".buttons-container .list-group-item"),
        flashcardsDiv: document.getElementById("flashcards"),
        flashcardTopic: document.getElementById("topic"),
        flashcardQuestion: document.getElementById("question"),
        flashcardId: undefined,
        createFlashcardButton: document.getElementById("create-flashcard-button"),

        // Ongoing flashcard page
        flashcardPage: document.getElementById("flashcard-page"),
        flashcardForm: document.getElementById("flashcard-form"),
        answerInput: document.getElementById("answer"),
        flashcardAnswer: undefined,

        // Flashcard feedback page
        flashcardFeedback: document.getElementById("flashcard-feedback"),
        feedbackUserAnswer: document.getElementById("user-answer"),
        feedbackFlashcardAnswer: document.getElementById("flashcard-answer"),
        feedbackButtons: document.querySelectorAll("#buttons-div button"),
    };
   
    function initFlashcards() {
        flashcardsVariablesObject.flashcards.forEach((button) => assignFlashcardsEventListeners(button));
        flashcardsVariablesObject.flashcardForm.addEventListener("submit", (event) => handleFlashcardForm(event));
        flashcardsVariablesObject.feedbackButtons.forEach((button) => assignFeedbackBtnEventListeners(button));
    }

    function assignFlashcardsEventListeners(button) {
        button.addEventListener("click", (event) => handleFlashcards(event));
    }

    function handleFlashcards(event) {
        event.preventDefault();

        flashcardsVariablesObject.createFlashcardButton.style.display = "none";
        flashcardsVariablesObject.flashcardId = event.currentTarget.parentElement.querySelector(".flashcard-id") ?
            event.currentTarget.parentElement.querySelector(".flashcard-id").textContent : "Id not found";

        const topic = event.currentTarget.querySelector("p.mb-1") ? event.currentTarget.querySelector("p.mb-1").textContent : "Topic not found";
        const question = event.currentTarget.querySelector("h4.mb-1") ? event.currentTarget.querySelector("h4.mb-1").textContent : "Question not found";
        const answer = event.currentTarget.parentElement.querySelector(".flashcard-answer") ? 
            event.currentTarget.parentElement.querySelector(".flashcard-answer").textContent : "Answer not found";

        flashcardsVariablesObject.flashcardTopic.textContent = topic;
        flashcardsVariablesObject.flashcardQuestion.textContent = question;
        flashcardsVariablesObject.flashcardAnswer = answer; // Update the global variable with the current flashcard's answer

        flashcardsVariablesObject.flashcardsDiv.style.display = "none";
        flashcardsVariablesObject.flashcardPage.style.display = "block";
    }

    function handleFlashcardForm(event) {
        event.preventDefault();
        const formAnswer = flashcardsVariablesObject.flashcardForm.answer.value;
        flashcardsVariablesObject.feedbackUserAnswer.textContent = formAnswer;
        flashcardsVariablesObject.feedbackFlashcardAnswer.textContent = flashcardsVariablesObject.flashcardAnswer;
        flashcardsVariablesObject.flashcardPage.style.display = "none";
        flashcardsVariablesObject.flashcardFeedback.style.display = "block";
    }

    function assignFeedbackBtnEventListeners(button) {
        button.addEventListener("click", (event) => handleFeedbackPage(event));
    }

    function handleFeedbackPage(event) {
        sendFlashcardFeedbackToServer(event);
        changeFeedbackPageToDefault();
    }

    function changeFeedbackPageToDefault() {
        flashcardsVariablesObject.createFlashcardButton.style.display = "block";
        flashcardsVariablesObject.answerInput.value = "";
        flashcardsVariablesObject.flashcardFeedback.style.display = "none";
        flashcardsVariablesObject.flashcardsDiv.style.display = "flex";
    }

    function sendFlashcardFeedbackToServer(event) {
        event.preventDefault();
        var buttonValue = event.target.value;
        var flashcardId = flashcardsVariablesObject.flashcardId;

        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "flashcardFeedback",
                buttonValue: buttonValue,
                flashcardId: flashcardId
            },
            sucess: function(data) {
                console.log(data)
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    return {
        initFlashcards: initFlashcards
    };
})();
