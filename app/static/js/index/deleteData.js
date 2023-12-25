const DeleteDataModule = (() => {
    deleteDataVarObject = {
        dialogOverlay: document.getElementById("dialog-overlay"),
        deleteProgressBtn: document.getElementById("delete-progress-button"),
        deleteProgressDialog: document.getElementById("delete-progress-dialog"),
        deleteProgressCloseBtn: document.getElementById("delete-progress-close-button"),
        deleteProgressPassInput: document.getElementById("confirm-progress-del-input"),
        deleteProgressConfirmBtn: document.getElementById("confirm-delete-p-button"),
        deleteAccountBtn: document.getElementById("delete-account-button"),
        deleteAccountDialog: document.getElementById("delete-account-dialog"),
        deleteAccountCloseBtn: document.getElementById("delete-account-close-button"),
        deleteAccountPassInput: document.getElementById("confirm-password-account"),
        deleteAccountConfirmBtn: document.getElementById("confirm-delete-a-button")
    }

    function initDeleteData() {
        const d = deleteDataVarObject;
        d.deleteProgressBtn.addEventListener("click", displayDelProgressDialog);
        d.deleteProgressCloseBtn.addEventListener("click", closeDelProgressDialog);
        d.deleteProgressConfirmBtn.addEventListener("click", (event) => handleConfirmProgress(event));
        d.deleteAccountBtn.addEventListener("click", displayDelAccountDialog);
        d.deleteAccountCloseBtn.addEventListener("click", closeDelAccountDialog);
        d.deleteAccountConfirmBtn.addEventListener("click", (event) => handleConfirmAccount(event));
    }

    function displayDelProgressDialog() {
        const d = deleteDataVarObject;
        d.dialogOverlay.style.display = "block";
        d.deleteProgressDialog.style.display = "block";
    }

    function closeDelProgressDialog() {
        const d = deleteDataVarObject;
        d.dialogOverlay.style.display = "none";
        d.deleteProgressDialog.style.display = "none";
        d.deleteProgressPassInput.value = "";
    }

    function handleConfirmProgress(event) {
        event.preventDefault();
        const d = deleteDataVarObject;
        var passwordInput = d.deleteProgressPassInput.value;
        checkPasswordServerSidePrg(passwordInput);
        d.dialogOverlay.style.display = "none";
        d.deleteProgressDialog.style.display = "none";
        d.deleteProgressPassInput.value = "";
    }

    function displayDelAccountDialog() {
        const d = deleteDataVarObject;
        d.dialogOverlay.style.display = "block";
        d.deleteAccountDialog.style.display = "block";
    }

    function closeDelAccountDialog() {
        const d = deleteDataVarObject;
        d.dialogOverlay.style.display = "none";
        d.deleteAccountDialog.style.display = "none";
        d.deleteAccountPassInput.value = "";
    }

    function handleConfirmAccount(event) {
        event.preventDefault();
        const d = deleteDataVarObject;
        var passwordInput = d.deleteAccountPassInput.value;
        checkPasswordServerSideAcc(passwordInput);
        d.dialogOverlay.style.display = "none";
        d.deleteAccountDialog.style.display = "none";
        d.deleteAccountPassInput.value = "";
    }

    function checkPasswordServerSidePrg(password) {
        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "checkUserPassword",
                password: password,
            },
            success: function(data) {
                if (data.success == true) {
                    deleteUserProgressServerSide();
                } else {
                    return false;
                }
            }, 
            error: function(error) {
                return false;
            }
        });
    }

    function deleteUserProgressServerSide() {
        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "deleteUserProgress"
            },
            success: function(data) {
                location.reload();
            },
            error: function(error) {
                alert("Internal server error 500");
            }
        });
    }

    function checkPasswordServerSideAcc(password) {
        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "checkUserPassword",
                password: password,
            },
            success: function(data) {
                if (data.success == true) {
                    deleteUserAccount();
                } else {
                    return false;
                }
            }, 
            error: function(error) {
                return false;
            }
        });
    }

    function deleteUserAccount() {
        $.ajax({
            type: "POST",
            url: "/operations_server_side",
            data: {
                operation: "deleteAccount"
            },
            success: function(data) {
                window.location.href = "/register";
            }, 
            error: function(error) {
                return false;
            }
        });
    }

    return {
        initDeleteData: initDeleteData
    };
})();
