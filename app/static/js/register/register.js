const registerModule = (() => {
    const registerVarObject = {
        minPasswordLen: 10,
        validMinLength: 6,
        validMaxLength: 25,
        passwordIndex: document.getElementById("password-index"),
        nameInput: document.getElementById("username"),
        passwordInput: document.getElementById("password"),
        confirmPasswordInput: document.getElementById("confirm-password"),
        registerForm: document.getElementById("register-form")
    }

    function initRegister() {
        const r = registerVarObject;
        r.nameInput.addEventListener("input", checkUsername);
        r.passwordInput.addEventListener("input", checkPassword);
        r.confirmPasswordInput.addEventListener("input", checkConfirmPassword);
        r.registerForm.addEventListener("submit", (event) => checkInputs(event));
    }

    function checkPassword() {
        const r = registerVarObject;
        var password = r.passwordInput.value;
        var passwordValid = passwordHasSpace(password);
        const sanitizedPassword = sanitizePassword(password);
        var result = zxcvbn(password);
        var confirmPassword = password === r.confirmPasswordInput.value;
        var inputtedConfirmPassword = r.confirmPasswordInput.value;

        // Dynamically display password feedback
        if (!passwordValid) {
            if (password && result.score >= 3) {
                r.passwordIndex.textContent = "Strong password"
                r.passwordIndex.style.display = "block";
                r.passwordIndex.style.color = "#4dc959";
            } else if (password && result.score === 2) {
                r.passwordIndex.textContent = `Average password. ${result.feedback.suggestions.join(", ")}`
                r.passwordIndex.style.display = "block";
                r.passwordIndex.style.color = "#E99A27";
            } else if (password && result.score === 1) {
                r.passwordIndex.textContent = `Weak password. ${result.feedback.suggestions.join(", ")}`
                r.passwordIndex.style.display = "block";
                r.passwordIndex.style.color = "#b31010";
            } else if (password && result.score === 0) {
                r.passwordIndex.textContent = `Very weak password. ${result.feedback.suggestions.join(", ")}`
                r.passwordIndex.style.display = "block";
                r.passwordIndex.style.color = "#b31010";
            } else if (password && password.length < r.minPasswordLen && confirmPassword) {
                r.passwordIndex.textContent = "Minimum length for passwords is 10 characters";
                r.passwordIndex.style.display = "block";
            } else if (password && inputtedConfirmPassword) {
                if (password !== inputtedConfirmPassword) {
                    r.passwordIndex.textContent = "Passwords must match";
                    r.passwordIndex.style.color = "#000000";
                    r.passwordIndex.style.display = "block";
                }                
            } else {
                r.passwordIndex.textContent = "";
                r.passwordIndex.style.display = "none";
                r.passwordIndex.style.color = "#000000";
            }
        } else {
            // Warns user of no special characters allowed
            r.passwordInput.value = sanitizedPassword;
            r.passwordIndex.textContent = "No space characters allowed on password";
            r.passwordIndex.style.display = "block";
        }
    }

    function checkConfirmPassword() {
        const r = registerVarObject;
        var confirmPassword = r.confirmPasswordInput.value;
        const sanitizedConfirmPassword = sanitizePassword(confirmPassword);
        r.confirmPasswordInput.value = sanitizedConfirmPassword;
    }
    
    // Check for special characters input in username and set minimum length
    function checkUsername() {
        const r = registerVarObject;
        var username = r.nameInput.value;
        var nameValid = !hasSpecialCharacter(username);
        const sanitizedUsername = sanitizeInput(username);

        if (username && !nameValid) {
            r.nameInput.value = sanitizedUsername;
            r.passwordIndex.style.display = "block";
            r.passwordIndex.textContent = "No other special characters allowed on names";
        } else if (username && username.length < r.validMinLength) {
            r.passwordIndex.style.display = "block";
            r.passwordIndex.style.color = "#000000";
            r.passwordIndex.textContent = "Minimum username length is 6 characters";
        } else if (username && username.length > r.validMaxLength) {
            r.passwordIndex.style.display = "block";
            r.passwordIndex.textContent = "Maximum username length is 25 characters";
        } else {
            r.passwordIndex.style.display = "none";
            r.passwordIndex.textContent = "";
        }
    }

    function confirmPassword() {
        const r = registerVarObject;
        const password = r.passwordInput.value;
        const confirmPassword = r.confirmPasswordInput.value;
    
        if (password === confirmPassword) {
            return true;
        } else {
            alert("Passwords must match.")
            return false;
        }
    }

    // Checks for space in passwords
    function passwordHasSpace(password) {
        var space = /\s/;
        return space.test(password);
    }

    // Sanitizes passwords from spaces
    function sanitizePassword(password) {
        var sanitizePassword = password.replace(/\s/, "");
        return sanitizePassword;
    }

    // Sanitizes user input server side to remove special characters
    function sanitizeInput(inputString) {
        var sanitizedValue = inputString.replace(/[!@#$%^&*()+{}\[\]:;<>,.?~\\/\-\s]/g, "");
        return sanitizedValue;
    }

    // Checks for special not valid characters on user input
    function hasSpecialCharacter(userInput) {
        var specialCharacterRegex = /[!@#$%^&*()+{}\[\]:;<>,.?~\\/\-\s]/;
        return specialCharacterRegex.test(userInput);
    }

    // Compact functions to check user input
    function checkInputs(event) {
        const r = registerVarObject;
        const isUsernameValid = !hasSpecialCharacter(r.nameInput.value);
        const matchingPasswords = confirmPassword();
        const validationExpression = (
            r.nameInput.value.length >= r.validMinLength &&
            r.nameInput.value.length <= r.validMaxLength &&
            r.passwordInput.value.length >= r.minPasswordLen
        );

        // Perform validation checks
        const isValid = isUsernameValid && matchingPasswords && validationExpression;

        if (!isValid) {
            event.preventDefault();
            r.passwordIndex.textContent = "Invalid input, please check username and password or try a different name."
        } else {
            event.preventDefault();
            handleRegister(r.nameInput.value, r.passwordInput.value, r.confirmPasswordInput.value)
        }

        return isValid;
    }

    function handleRegister(username, password, confirmPassword) {
        $.ajax({
            type: "POST",
            url: "/operations_no_login",
            data: {
                operation: "registerUser",
                username: username,
                password: password,
                confirmPassword: confirmPassword
            },
            success: function(data) {                    
                if (data.success === true) {
                    window.location.href = "/login";
                    return true
                } else if (data.success === false) {
                    registerVarObject.passwordIndex.style.display = "block";
                    registerVarObject.passwordIndex.textContent = "Invalid request. Please check your username and password.";
                    return false;
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    return {
        initRegister: initRegister
    };
})();

$(document).ready(registerModule.initRegister());
