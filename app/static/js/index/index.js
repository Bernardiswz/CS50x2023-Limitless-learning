const IndexModule = (function() {
    const indexVarObject = {
        pomodoroChart: document.getElementById("pomodoro-chart"),
        flashcardsChart: document.getElementById("flashcards-chart"),
        flashcardsSelect: document.getElementById("flashcards-select"),
        queriedUserData: undefined
    };

    const flashcardsChart = new Chart(indexVarObject.flashcardsChart, {
        type: "bar",
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });

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
        updateFlashcardsChart(matchingFlashcard);
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
            const date = entry.timestamp.split(' ')[0]; // Extract the date part
            accumulator[date] = (accumulator[date] || 0) + (entry.action === 'finished_pomodoro' ? 1 : 0);
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


    function createFlashcardsChart() {
        new Chart(indexVarObject.pomodoroChart, {
            type: "bar",
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }
    

    function updateFlashcardsChart(flashcard) {
        const dailyRatingsCounts = {};

        // Extract date from timestamp
        const date = flashcard.timestamp.split(' ')[0];
    
        // Check if the date is already in the object; if not, initialize it
        if (!dailyRatingsCounts[date]) {
            dailyRatingsCounts[date] = {};
        }
    
        // Iterate through ratings for the flashcard
        flashcard.ratings.forEach(rating => {
            // Check if the rating is already in the object; if not, initialize it
            if (!dailyRatingsCounts[date][rating.rating]) {
                dailyRatingsCounts[date][rating.rating] = 0;
            }
    
            // Increment the count for the rating
            dailyRatingsCounts[date][rating.rating]++;
        });
    
        // Extract labels and data for the chart
        const labels = Object.keys(dailyRatingsCounts);
        const data = Object.values(dailyRatingsCounts);
    
        // Assuming you have a dataset for each rating (very-easy, medium, hard)
        const datasets = indexVarObject.flashcardsChart.data.datasets;
    
        // Update the existing datasets with new data
        datasets.forEach(dataset => {
            const rating = dataset.label.toLowerCase(); // Convert label to lowercase
            dataset.data = data.map(entry => entry[rating] || 0);
        });
    
        // Update labels
        indexVarObject.flashcardsChart.data.labels = labels;
    
        // Update the chart
        indexVarObject.flashcardsChart.update();
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
