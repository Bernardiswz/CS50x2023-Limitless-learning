const loginModule = (() => {
    const loginVarObject = {
        passwordIndex: document.getElementById("password-index"),
        nameInput: document.getElementById("username"),
        passwordInput: document.getElementById("password"),
        loginForm: document.getElementById("login-form"),
        minPasswordLen: 10,
        // Username lengths
        validMinLength: 6,
        validMaxLength: 25
    }

    function initLogin() {
        const l = loginVarObject;
        l.nameInput.addEventListener("input", checkUsername);
        l.passwordInput.addEventListener("input", checkPassword);
        l.loginForm.addEventListener("submit", (event) => checkInputs(event));
    }

    // Check for special characters input in username and set minimum length
    function checkUsername() {
        const l = loginVarObject;
        const username = l.nameInput.value;
        const nameValid = !hasSpecialCharacter(username);
        const sanitizedUsername = sanitizeInput(username);

        if (username && !nameValid) {
            l.nameInput.value = sanitizedUsername;
            l.passwordIndex.style.display = "block";
            l.passwordIndex.textContent = "No other special characters allowed on names";
        } else if (username && username.length < l.validMinLength) {
            l.passwordIndex.style.display = "block";
            l.passwordIndex.textContent = "Minimum username length is 6 characters";
        } else if (username && username.length > l.validMaxLength) {
            l.passwordIndex.style.display = "block";
            l.passwordIndex.textContent = "Maximum username length is 25 characters";
        } else {
            l.passwordIndex.style.display = "none";
            l.passwordIndex.textContent = "";
        }
    }

    function checkPassword() {
        const l = loginVarObject;
        const password = l.passwordInput.value;
        const passwordValid = !passwordHasSpace(password);
        const sanitizedPassword = sanitizePassword(password);
        const result = zxcvbn(password);
        
        // Dynamically display password feedback
        if (passwordValid) {
            if (password && password.length < l.minPasswordLen) {
                l.passwordIndex.textContent = "Minimum length for passwords is 10 characters";
                l.passwordIndex.style.display = "block";
            } else {
                l.passwordIndex.textContent = "";
                l.passwordIndex.style.display = "none";
                l.passwordIndex.style.color = "#000000";
            }
        } else {
            // Warns user of no special characters allowed
            l.passwordInput.value = sanitizedPassword;
            l.passwordIndex.textContent = "No space characters allowed on password";
            l.passwordIndex.style.display = "block";
        }
    }

    // Checks for special characters in username
    function hasSpecialCharacter(userInput) {
        var specialCharacterRegex = /[!@#$%^&*()+{}\[\]:;<>,.?~\\/\-\s]/;
        return specialCharacterRegex.test(userInput);
    }

    // Checks for space in password
    function passwordHasSpace(password) {
        const space = /\s/;
        return space.test(password);
    }

    // Sanitizes passwords from spaces
    function sanitizePassword(password) {
        const sanitizePassword = password.replace(/\s/, "");
        return sanitizePassword;
    }

    // Sanitizes user input client side
    function sanitizeInput(inputString) {
        const sanitizedValue = inputString.replace(/[!@#$%^&*()+{}\[\]:;<>,.?~\\/\-\s]/g, "");
        return sanitizedValue;
    }

    function checkInputs(event) {
        const l = loginVarObject;
        const isUsernameValid = !hasSpecialCharacter(l.nameInput.value);
        const validationExpression = (
            l.nameInput.value.length >= l.validMinLength &&
            l.nameInput.value.length <= l.validMaxLength &&
            l.passwordInput.value.length >= l.minPasswordLen
        );
        const username = l.nameInput.value;
        const password = l.passwordInput.value;
        const tryLogin = handleLogin(username, password);

        if (!(isUsernameValid && validationExpression) || !tryLogin) {
            event.preventDefault();
            l.passwordIndex.style.display = "block";
            l.passwordIndex.textContent = "Invalid request. Please check your username and password.";
        } else {
            l.passwordIndex.style.display = "none";
            l.passwordIndex.textContent = "";
        }
    }

    function handleLogin(username, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/operations_server_side",
                data: {
                    operation: "tryAuthentication",
                    username: username,
                    password: password
                },
                success: function(data) {
                    resolve(data);
                    
                    if (data.success) {
                        return true;
                    } else {
                        return false
                    }
                },
                error: function(error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    return {
        initLogin: initLogin
    };
})();

$(document).ready(loginModule.initLogin());
