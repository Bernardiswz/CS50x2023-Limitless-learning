const IndexModule = (function() {
    const indexVarObject = {
        usernameElement: document.getElementById("username-element"),
        queriedUserData: undefined
    }

    function initIndex() {
        queryUserData();
    }

    function updatePageElements(data) {
        console.log(data)
        indexVarObject.usernameElement.textContent = data.username.username;
    }

    function queryUserData() {
        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "queryUserData"
            },
            success: function(data) {
                indexVarObject.queriedUserData = data.userData;
                updatePageElements(indexVarObject.queriedUserData);
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
