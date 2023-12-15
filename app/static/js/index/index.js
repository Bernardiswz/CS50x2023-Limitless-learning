const IndexModule = (function() {
    const indexVarObject = {
        usernameElement: document.getElementById("username-element"),
        pomodoroChart: document.getElementById("pomodoroChart")
    };

    function initIndex() {
        queryUserData();
    }

    function updatePageElements(data) {
        createCharts();
        console.log(data);
    }

    function createCharts() {
        const pomodoroChart = document.getElementById("pomodoro-chart");

        new Chart(pomodoroChart, {
            type: "line",
            data: {
                labels: ["Red", "Blue"],
                datasets: [{
                    label: "# of Votes",
                    data: [12, 19],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 0,
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
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
