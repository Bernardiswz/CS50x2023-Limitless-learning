const IndexModule = (function() {

    function initIndex() {
        queryUserData();
    }

    function queryUserData() {
        $.ajax({
            type: "POST",
            url: "/update_data",
            data: {
                operation: "queryUserData"
            },
            success: function(data) {
                console.log(data)
            }
        });
    }

    return {
        initIndex: initIndex
    }
})();

$(document).ready(function() {
    IndexModule.initIndex();
});