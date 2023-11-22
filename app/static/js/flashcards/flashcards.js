function main() {
    var flashcards = document.querySelectorAll(".buttons-container .list-group-item");
    var flashcardsDiv = document.getElementById("flashcards"); // Div of the flashcards
    const flashcardPage = document.getElementById("flashcard-page"); // Dynamism on the same page for the flashcards functionality
    const flashcardForm = document.getElementById("flashcard-form");
    var flashcardAnswer;

    // Elements of current flashcard div
    const flashcardTopic = document.getElementById("topic");
    const flashcardQuestion = document.getElementById("question");

    var isFlashcardPage = false;

    console.log("Flashcards:", flashcards.length);

    flashcards.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            var topic = button.querySelector("p") ? button.querySelector("p").textContent: "Topic not found";
            var question = button.querySelector("h4") ? button.querySelector("h4").textContent : "Question not found";
            var answer = button.querySelector(".answer") ? button.querySelector(".answer").textContent : "Answer not found";
            flashcardAnswer = answer;

            flashcardTopic.textContent = topic;
            flashcardQuestion.textContent = question;
            
            flashcardsDiv.style.display = "none";
            flashcardPage.style.display = "block";
            isFlashcardPage = true;
        });
    });

    if (isFlashcardPage) {
        flashcardForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const answer = flashcardForm.answer.value;
        });
    }
}

document.addEventListener("DOMContentLoaded", main);
