/* Const variables of minimum password length and the minimum and maximun username lengths */
const minPasswordLen = 10;
const validMinLength = 6;
const validMaxLength = 25;

// Check password client side
function checkPassword() {
    // Variables to handle the password strength verification
    const passwordIndex = document.getElementById("password-index");
    var passwordInput = document.getElementById("password");
    var password = passwordInput.value;
    var passwordValid = passwordHasSpace(password);
    const sanitizedPassword = sanitizePassword(password);
    var result = zxcvbn(password);
    
    // Dynamically display password feedback
    if (!passwordValid) {
        if (password && result.score >= 3) {
            passwordIndex.textContent = "Strong password"
            passwordIndex.style.display = "block";
            passwordIndex.style.color = "#4dc959";
        } else if (password && result.score === 2) {
            passwordIndex.textContent = `Average password. ${result.feedback.suggestions.join(", ")}`
            passwordIndex.style.display = "block";
            passwordIndex.style.color = "#E99A27";
        } else if (password && result.score === 1) {
            passwordIndex.textContent = `Weak password. ${result.feedback.suggestions.join(", ")}`
            passwordIndex.style.display = "block";
            passwordIndex.style.color = "#b31010";
        } else if (password && password.length < minPasswordLen) {
            passwordIndex.textContent = "Minimum length for passwords is 10 characters";
            passwordIndex.style.display = "block";
        } else {
            passwordIndex.textContent = "";
            passwordIndex.style.display = "none";
            passwordIndex.style.color = "#000000";
        }
    } else {
        // Warns user of no special characters allowed
        passwordInput.value = sanitizedPassword;
        passwordIndex.textContent = "No space characters allowed on password";
        passwordIndex.style.display = "block";
    }
}

// Check for special characters input in username and set minimum length
function checkUsername() {
    const passwordIndex = document.getElementById("password-index");
    var nameInput = document.getElementById("username");
    var username = nameInput.value;
    var nameValid = !hasSpecialCharacter(username);
    const sanitizedUsername = sanitizeInput(username);

    if (username && !nameValid) {
        nameInput.value = sanitizedUsername;
        passwordIndex.style.display = "block";
        passwordIndex.textContent = "No other special characters allowed on names";
    } else if (username && username.length < validMinLength) {
        passwordIndex.style.display = "block";
        passwordIndex.textContent = "Minimum username length is 6 characters";
    } else if (username && username.length > validMaxLength) {
        passwordIndex.style.display = "block";
        passwordIndex.textContent = "Maximum username length is 25 characters";
    } else {
        passwordIndex.style.display = "none";
        passwordIndex.textContent = "";
    }
}

// Checks for whether password and confirm password match
function confirmPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

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

// Compact functions to check userinput
function checkInputs() {
    const nameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const isUsernameValid = !hasSpecialCharacter(nameInput.value);
    const matchingPasswords = confirmPassword();
    var validationExpression = (nameInput.value.length >= validMinLength && nameInput.value.length <= validMaxLength && 
        passwordInput.value.length >= minPasswordLen);

    nameInput.addEventListener("input", checkUsername);
    passwordInput.addEventListener("input", checkPassword);

    if (isUsernameValid && matchingPasswords && validationExpression) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}

document.addEventListener("DOMContentLoaded", checkInputs);
