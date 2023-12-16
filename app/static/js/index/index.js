const IndexModule = (function() {
    const indexVarObject = {
        pomodoroChart: document.getElementById("pomodoro-chart"),
        flashcardsChart: document.getElementById("flashcards-chart")
    };

    function initIndex() {
        queryUserData();
    }

    function updatePageElements(data) {
        createPomodoroChart(data);
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

    function createFlashcardsChart(userData) {
        const userFlashcards = userData.user_flashcards;

        // Group user history by day and count finished_pomodoros for each day
        const pomodoroDailyCounts = userFlashcards.reduce((accumulator, entry) => {
            const date = entry.timestamp.split(' ')[0];
            accumulator[date] = (accumulator[date] || 0) + (entry.action === 'finished_pomodoro' ? 1 : 0);
            return accumulator;
        }, {});
    
        const labels = Object.keys(pomodoroDailyCounts);
        const data = Object.values(pomodoroDailyCounts);

        new Chart(indexVarObject.flashcardsChart, {
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

    function queryUserData() {
        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "queryUserData"
            },
            success: function(data) {
                console.log(JSON.stringify(data, null, 2));
                updatePageElements(data.userData);
            },
            error: function(error) {
                console.log(error);
                alert(error);
            }
        });
    }

    return {
        initIndex: initIndex
    }
})();

$(document).ready(IndexModule.initIndex);
