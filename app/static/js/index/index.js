const IndexModule = (function() {
    const flashcardElementsObj = {
        flashcardTopic: document.getElementById("flashcard-topic"),
        flashcardQuestion: document.getElementById("flashcard-question"),
        flashcardAnswer: document.getElementById("flashcard-answer"),
        flashcardTimestamp: document.getElementById("flashcard-timestamp"),
        veryEasyCount: document.getElementById("very-easy-count"),
        easyCount: document.getElementById("easy-count"),
        mediumCount: document.getElementById("medium-count"),
        hardCount: document.getElementById("hard-count"),
        veryHardCount: document.getElementById("very-hard-count")
    }

    const indexVarObject = {
        pomodoroChart: document.getElementById("pomodoro-chart"),
        flashcardsChart: document.getElementById("flashcards-chart"),
        flashcardsSelect: document.getElementById("flashcards-select"),
        flashcardDataDiv: document.getElementById("flashcard-data"),
        flashcardRatingsDiv: document.getElementById("flashcard-ratings-div"),
        flashcardAttributes: [flashcardElementsObj.flashcardTopic, flashcardElementsObj.flashcardQuestion, 
            flashcardElementsObj.flashcardAnswer, flashcardElementsObj.flashcardTimestamp],
        flashcardRatings: [flashcardElementsObj.veryEasyCount, flashcardElementsObj.easyCount, flashcardElementsObj.mediumCount,
            flashcardElementsObj.hardCount, flashcardElementsObj.veryHardCount],
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
        const getFlashcardRatingsCount = countRatings(flashcard.ratings);
        
        flashcardElementsObj.veryEasyCount.textContent = getFlashcardRatingsCount["very-easy"];
        flashcardElementsObj.easyCount.textContent = getFlashcardRatingsCount["easy"];
        flashcardElementsObj.mediumCount.textContent = getFlashcardRatingsCount["medium"];
        flashcardElementsObj.hardCount.textContent = getFlashcardRatingsCount["hard"];
        flashcardElementsObj.veryHardCount.textContent = getFlashcardRatingsCount["very-hard"];

        flashcardElementsObj.flashcardTopic.textContent = `Topic: ${flashcard.topic}`;
        flashcardElementsObj.flashcardQuestion.textContent = flashcard.question;
        flashcardElementsObj.flashcardAnswer.textContent = `Answer: ${flashcard.answer}`;
        flashcardElementsObj.flashcardTimestamp.textContent = `Created in ${flashcard.timestamp}`;
        indexVarObject.flashcardDataDiv.style.display = "block";
        indexVarObject.flashcardRatingsDiv.style.display = "flex";
    }

    function countRatings(ratings) {
        var ratingsDict = {
            "very-easy": 0,
            "easy": 0,
            "medium": 0,
            "hard": 0,
            "very-hard": 0
        }

        for (let currentRating of ratings) {
            if (currentRating["rating"] in ratingsDict) {
                ratingsDict[`${currentRating["rating"]}`]++;
            }
        }

        return ratingsDict;
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
