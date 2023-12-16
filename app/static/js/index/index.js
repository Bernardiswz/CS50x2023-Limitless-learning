const IndexModule = (function() {
    const indexVarObject = {
        usernameElement: document.getElementById("username-element"),
        pomodoroChart: document.getElementById("pomodoro-chart")
    };

    function initIndex() {
        queryUserData();
    }

    function updatePageElements(data) {
        createCharts(data);
        updateUserHeader(data);
        // console.log(data);
    }

    function updateUserHeader(userData) {
        indexVarObject.usernameElement.textContent = userData.username.username
    }

    function createCharts(userData) {
        const userHistory = userData.userHistory;
    
        // Group user history by day and count finished_pomodoros for each day
        const dailyCounts = userHistory.reduce((accumulator, entry) => {
            const date = entry.timestamp.split(' ')[0]; // Extract the date part
            accumulator[date] = (accumulator[date] || 0) + (entry.action === 'finished_pomodoro' ? 1 : 0);
            return accumulator;
        }, {});
    
        const labels = Object.keys(dailyCounts);
        const data = Object.values(dailyCounts);
    
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

    function queryUserData() {
        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "queryUserData"
            },
            success: function(data) {
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
