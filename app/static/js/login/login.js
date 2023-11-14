function checkPassword() {
    const minPasswordLen = 10;
    const passwordIndex = document.getElementById("password-index");
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    const passwordValid = !passwordHasSpace(password);
    const sanitizedPassword = sanitizePassword(password);
    const result = zxcvbn(password);
    
    // Dynamically display password feedback
    if (passwordValid) {
        if (password && password.length < minPasswordLen) {
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
    const validMinLength = 6;
    const validMaxLength = 25;
    const passwordIndex = document.getElementById("password-index");
    const nameInput = document.getElementById("username");
    const username = nameInput.value;
    const nameValid = !hasSpecialCharacter(username);
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

// Sanitizes user input server side to remove special characters
function sanitizeInput(inputString) {
    const sanitizedValue = inputString.replace(/[!@#$%^&*()+{}\[\]:;<>,.?~\\/\-\s]/g, "");
    return sanitizedValue;
}


// Compact functions to check user input
function checkInputs(event) {
    const nameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const passwordIndex = document.getElementById("password-index"); // Ensure you get passwordIndex here
    const validMinLength = 6; // Define validMinLength here
    const validMaxLength = 25; // Define validMaxLength here
    const minPasswordLen = 10; // Define minPasswordLen here

    const isUsernameValid = !hasSpecialCharacter(nameInput.value);
    const validationExpression = (
        nameInput.value.length >= validMinLength &&
        nameInput.value.length <= validMaxLength &&
        passwordInput.value.length >= minPasswordLen
    );

    if (!(isUsernameValid && validationExpression)) {
        event.preventDefault();
        passwordIndex.style.display = "block";
        passwordIndex.textContent = "Invalid input. Please check your username and password.";
    } else {
        passwordIndex.style.display = "none";
        passwordIndex.textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Add initial event listeners
    const nameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    nameInput.addEventListener("input", checkUsername);
    passwordInput.addEventListener("input", checkPassword);

    // Add event listener directly to form's onsubmit attribute
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", checkInputs);
    }
});

