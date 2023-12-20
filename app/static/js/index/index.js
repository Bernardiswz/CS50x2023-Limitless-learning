const IndexModule = (function() {
    const indexVarObject = {
        pomodoroChart: document.getElementById("pomodoro-chart"),
        flashcardsChart: document.getElementById("flashcards-chart"),
        flashcardsSelect: document.getElementById("flashcards-select"),
        flashcardDataDiv: document.getElementById("flashcard-data"),
        queriedUserData: undefined
    };

    function initIndex() {
        queryUserData()
            .then(userData => {
                updatePageElements(userData);

                indexVarObject.flashcardsSelect.addEventListener("change", initSelectFunctionality);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function updatePageElements(data) {
        createPomodoroChart(data);
    }

    function initSelectFunctionality() {
        var selectedFlashcard = indexVarObject.flashcardsSelect.options[indexVarObject.flashcardsSelect.selectedIndex];
        var selectedFlashcardId = selectedFlashcard.value;
        var matchingFlashcard = getFlashcardById(selectedFlashcardId);
        console.log(matchingFlashcard);
        createFlashcardElement(matchingFlashcard);
    }

    function getFlashcardById(flashcardId) {
        var flashcardObject = indexVarObject.queriedUserData.user_flashcards;
        const foundFlashcard = flashcardObject.find(flashcard => flashcard.flashcard_id === parseInt(flashcardId));
        return foundFlashcard || null;
    }

    function createPomodoroChart(userData) {
        const userHistory = userData.pomodoros_history;
    
        // Group user history by day and count finished_pomodoros for each day
        const pomodoroDailyCounts = userHistory.reduce((accumulator, entry) => {
            const date = entry.timestamp.split(" ")[0]; // Extract the date part
            accumulator[date] = (accumulator[date] || 0) + (entry.action === "finished_pomodoro" ? 1 : 0);
            return accumulator;
        }, {});
    
        const labels = Object.keys(pomodoroDailyCounts);
        const data = Object.values(pomodoroDailyCounts);
    
        new Chart(indexVarObject.pomodoroChart, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Number of finished Pomodoros",
                    data: data,
                    borderWidth: 1,
                    barPercentage: 0.4,
                    backgroundColor: "rgba(46, 102, 135, 0.85)",
                    borderColor: "rgba(35, 77, 102, 1)"
                }]
            },
            options: {
                responsive: true
            }
        });
    }
    
    function createFlashcardElement(flashcard) {
        var ulElements = indexVarObject.flashcardDataDiv.querySelectorAll("ul");
        var flashcardRatingsDiv = document.getElementById("flashcards-ratings-div");

        // If found already existing flashcard element, delete it to make room for the new one 
        if (ulElements) {
            ulElements.forEach(element => {
                element.remove();
            });
            flashcardRatingsDiv.remove();
        }
    
        const flashcardElement = document.createElement("ul");
        flashcardElement.classList.add("list-group", "flashcard-element-ul");

        flashcardElement.innerHTML = `
            <div class="list-group-item flex-column align-items-start buttons flashcard-element">
                <div class="flashcard-id" style="display: none;">Flashcard Id</div>
                <div class="flashcard-answer" style="display: none;">Flashcard Answer</div>
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1 flashcard-topic">${flashcard.topic}</p>
                    <small class="time-ago">${flashcard.timestamp}</small>
                </div>
                <h4 class="mb-1 flashcard-question">${flashcard.question}</h4>
                <small class="timestamp">Answer: ${flashcard.answer}</small>
            </div>
        `;
        
        // const flashcardRatings = document.createElement("div");

        indexVarObject.flashcardDataDiv.appendChild(flashcardElement);
    }
    
    function queryUserData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/update_data",
                data: {
                    operation: "queryUserData"
                },
                success: function(data) {
                    indexVarObject.queriedUserData = data.userData;
                    resolve(data.userData);
                },
                error: function(error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    return {
        initIndex: initIndex
    }
})();

$(document).ready(IndexModule.initIndex);
