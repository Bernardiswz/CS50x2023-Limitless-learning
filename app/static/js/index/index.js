const IndexModule = (function() {
    const indexVarObject = {
        pomodoroChart: document.getElementById("pomodoro-chart"),
        flashcardsChart: document.getElementById("flashcards-chart"),
        flashcardsSelect: document.getElementById("flashcards-select"),
        currentFlashcardsChart: undefined,
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
        if (indexVarObject.currentFlashcardsChart) {
            indexVarObject.currentFlashcardsChart.destroy();
        }
    
        indexVarObject.currentFlashcardsChart = new Chart(indexVarObject.flashcardsChart, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Very Easy',
                    data: [],
                    backgroundColor: 'rgba(25, 135, 84, 0.85)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 1,
                    fill: false
                }, {
                    label: 'Easy',
                    data: [],
                    backgroundColor: 'rgba(13, 110, 253, 0.85)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    fill: false
                }, {
                    label: 'Medium',
                    data: [],
                    backgroundColor: 'rgba(255, 193, 7, 0.85)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1,
                    fill: false
                }, {
                    label: 'Hard',
                    data: [],
                    backgroundColor: 'rgba(220, 53, 69, 0.85)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1,
                    fill: false
                }, {
                    label: 'Very Hard',
                    data: [],
                    backgroundColor: 'rgba(33, 37, 41, 0.85)',
                    borderColor: 'rgba(33, 37, 41, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }
    
    function updateFlashcardsChart(flashcard) {
        console.log(flashcard);
    
        // Create a new chart
        createFlashcardsChart();
    
        // Initialize an object to store counts for each rating category on a given day
        const dailyRatingsCounts = {};
    
        // Iterate through ratings for the flashcard
        flashcard.ratings.forEach(ratingEntry => {
            // Extract the date from the timestamp
            const date = ratingEntry.timestamp.split(' ')[0];
    
            // Check if the rating is already in the object; if not, initialize it
            if (!dailyRatingsCounts[date]) {
                dailyRatingsCounts[date] = {
                    'very-easy': null,
                    'easy': null,
                    'medium': null,
                    'hard': null,
                    'very-hard': null
                };
            }
    
            // Increment the count for the corresponding rating category
            dailyRatingsCounts[date][ratingEntry.rating]++;
        });
    
        // Extract labels and data for the chart
        const labels = Object.keys(dailyRatingsCounts);
        const data = Object.values(dailyRatingsCounts);
    
        // Update the existing datasets with new data
        indexVarObject.currentFlashcardsChart.data.labels = labels;
        indexVarObject.currentFlashcardsChart.data.datasets.forEach(dataset => {
            const rating = dataset.label.toLowerCase();
            const uniqueLabel = rating; // Add timestamp or any other unique identifier if needed
            dataset.data = labels.map(date => dailyRatingsCounts[date][rating] || null);
            dataset.label = uniqueLabel; // Update the dataset label
            dataset.skipNull = true; // Add this line
        });
    
        // Update the chart
        indexVarObject.currentFlashcardsChart.update();
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
