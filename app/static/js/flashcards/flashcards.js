function main() {
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    var flashcardsDiv = document.getElementById("flashcards");
    const flashcardPage = document.getElementById("flashcard-page");
    const flashcardForm = document.getElementById("flashcard-form");
    var flashcardAnswer;

    const flashcardFeedback = document.getElementById("flashcard-feedback");
    const feedbackUserAnswer = document.getElementById("user-answer");
    const feedbackFlashcardAnswer = document.getElementById("flashcard-answer");

    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");

    flashcards.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            var topic = button.querySelector("p.mb-1") ? button.querySelector("p.mb-1").textContent : "Topic not found";
            var question = button.querySelector("h4.mb-1") ? button.querySelector("h4.mb-1").textContent : "Question not found";
            var answer = button.parentElement.querySelector(".answer") ? button.parentElement.querySelector(".answer").textContent : "Answer not found";
            flashcardAnswer = answer;

            console.log(flashcardAnswer);

            flashcardTopic.textContent = topic;
            flashcardQuestion.textContent = question;

            flashcardsDiv.style.display = "none";
            flashcardPage.style.display = "block";
        });
    });

    flashcardForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formAnswer = flashcardForm.answer.value;

        flashcardPage.style.display = "none";

        feedbackUserAnswer.textContent = formAnswer;
        feedbackFlashcardAnswer.textContent = flashcardAnswer;

        flashcardFeedback.style.display = "block";
    });
}

document.addEventListener("DOMContentLoaded", main);
