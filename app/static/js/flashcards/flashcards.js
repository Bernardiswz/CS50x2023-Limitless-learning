function main() {
    // Default page
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    var flashcardsDiv = document.getElementById("flashcards");
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");
    var flashcardId;

    // Flashcard page
    const flashcardPage = document.getElementById("flashcard-page");
    const flashcardForm = document.getElementById("flashcard-form");
    var flashcardAnswer;

    // Flashcard feedback page
    const flashcardFeedback = document.getElementById("flashcard-feedback");
    const feedbackUserAnswer = document.getElementById("user-answer");
    const feedbackFlashcardAnswer = document.getElementById("flashcard-answer");

    // Handle default page flashcard selecting
    flashcards.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            flashcardId = event.currentTarget.parentElement.querySelector(".flashcard-id") ?
                event.currentTarget.parentElement.querySelector(".flashcard-id").textContent : "Id not found";

            var topic = event.currentTarget.querySelector("p.mb-1") ? event.currentTarget.querySelector("p.mb-1").textContent : "Topic not found";
            var question = event.currentTarget.querySelector("h4.mb-1") ? event.currentTarget.querySelector("h4.mb-1").textContent : "Question not found";
            var answer = event.currentTarget.parentElement.querySelector(".answer") ? event.currentTarget.parentElement.querySelector(".answer").textContent : "Answer not found";

            flashcardTopic.textContent = topic;
            flashcardQuestion.textContent = question;
            flashcardAnswer = answer; // Update the global variable with the current flashcard's answer

            flashcardsDiv.style.display = "none";
            flashcardPage.style.display = "block";
        });
    });

    // Handle flashcard testing submit
    flashcardForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const formAnswer = flashcardForm.answer.value;
        console.log(formAnswer);

        flashcardPage.style.display = "none";

        feedbackUserAnswer.textContent = formAnswer;
        feedbackFlashcardAnswer.textContent = flashcardAnswer;

        flashcardFeedback.style.display = "block";
    });

    // Handle flashcard feedback
    var feedbackButtons = document.querySelectorAll("#buttons-div button");

    feedbackButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            var buttonValue = event.target.value;

            $.ajax({
                type: "POST",
                url: "/update_data",
                data: {
                    operation: "flashcardFeedback",
                    buttonValue: buttonValue,
                    flashcardId: flashcardId
                }
            });

            flashcardFeedback.style.display = "none";
            flashcardsDiv.style.display = "flex";

        });
    });
}

document.addEventListener("DOMContentLoaded", main);
