const FlashcardsVariablesObject = (function() {
    // Default page
    const flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    const flashcardsDiv = document.getElementById("flashcards");
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");
    var flashcardId;

    // Flashcard page
    const flashcardPage = document.getElementById("flashcard-page");
    const flashcardForm = document.getElementById("flashcard-form");
    const answerInput = document.getElementById("answer");
    var flashcardAnswer;

    // Flashcard feedback page
    const flashcardFeedback = document.getElementById("flashcard-feedback");
    const feedbackUserAnswer = document.getElementById("user-answer");
    const feedbackFlashcardAnswer = document.getElementById("flashcard-answer");
    var feedbackButtons = document.querySelectorAll("#buttons-div button");

    return {
        flashcards: flashcards,
        flashcardsDiv: flashcardsDiv,
        flashcardTopic: flashcardTopic,
        flashcardQuestion: flashcardQuestion,
        flashcardId: flashcardId,
        flashcardPage: flashcardPage,
        flashcardForm: flashcardForm,
        answerInput: answerInput,
        flashcardAnswer: flashcardAnswer,
        flashcardFeedback: flashcardFeedback,
        feedbackUserAnswer: feedbackUserAnswer,
        feedbackFlashcardAnswer: feedbackFlashcardAnswer,
        feedbackButtons: feedbackButtons
    }
})();

function init() {
    FlashcardsVariablesObject.flashcards.forEach((button) => assignFlashcardsEventListeners(button));
    FlashcardsVariablesObject.flashcardForm.addEventListener("submit", (event) => handleFlashcardForm(event));
    FlashcardsVariablesObject.feedbackButtons.forEach((button) => assignFeedbackBtnEventListeners(button));
}

function assignFlashcardsEventListeners(button) {
    button.addEventListener("click", (event) => handleFlashcards(event));
}

function handleFlashcards(event) {
    event.preventDefault();

    FlashcardsVariablesObject.flashcardId = event.currentTarget.parentElement.querySelector(".flashcard-id") ?
        event.currentTarget.parentElement.querySelector(".flashcard-id").textContent : "Id not found";

    const topic = event.currentTarget.querySelector("p.mb-1") ? event.currentTarget.querySelector("p.mb-1").textContent : "Topic not found";
    const question = event.currentTarget.querySelector("h4.mb-1") ? event.currentTarget.querySelector("h4.mb-1").textContent : "Question not found";
    const answer = event.currentTarget.parentElement.querySelector(".answer") ? event.currentTarget.parentElement.querySelector(".answer").textContent : "Answer not found";

    FlashcardsVariablesObject.flashcardTopic.textContent = topic;
    FlashcardsVariablesObject.flashcardQuestion.textContent = question;
    FlashcardsVariablesObject.flashcardAnswer = answer; // Update the global variable with the current flashcard's answer

    FlashcardsVariablesObject.flashcardsDiv.style.display = "none";
    FlashcardsVariablesObject.flashcardPage.style.display = "block";
}

function handleFlashcardForm(event) {
    event.preventDefault();
    const formAnswer = FlashcardsVariablesObject.flashcardForm.answer.value;
    FlashcardsVariablesObject.feedbackUserAnswer.textContent = formAnswer;
    FlashcardsVariablesObject.feedbackFlashcardAnswer.textContent = FlashcardsVariablesObject.flashcardAnswer;
    FlashcardsVariablesObject.flashcardPage.style.display = "none";
    FlashcardsVariablesObject.flashcardFeedback.style.display = "block";
}

function assignFeedbackBtnEventListeners(button) {
    button.addEventListener("click", (event) => handleFeedbackPage(event));
}

function handleFeedbackPage(event) {
    sendFlashcardFeedbackToServer(event);
    changeFeedbackPageToDefault();
}

function changeFeedbackPageToDefault() {
    FlashcardsVariablesObject.answerInput.value = "";
    FlashcardsVariablesObject.flashcardFeedback.style.display = "none";
    FlashcardsVariablesObject.flashcardsDiv.style.display = "flex";
}

function sendFlashcardFeedbackToServer(event) {
    event.preventDefault();
    var buttonValue = event.target.value;
    var flashcardId = FlashcardsVariablesObject.flashcardId;

    $.ajax({
        type: "POST",
        url: "/update_data",
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

document.addEventListener("DOMContentLoaded", init);
