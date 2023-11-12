function checkPassword() {
    // Variables to handle the password strength verification
    var passwordInput = document.getElementById("password");
    var password = passwordInput.value;
    var result = zxcvbn(password);

    // Password strength index element
    const passwordIndex = document.getElementById("password-index");


    // Dynamically display password feedback
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
    } else {
        passwordIndex.textContent = "";
        passwordIndex.style.display = "none";
        passwordIndex.style.color = "#000000";
    }


    console.clear();
    console.log("Password: " + password);
    console.log("Strength: " + result.score);
}

function hasSpecialCharacter(password) {
    var specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-\s]/;
    return specialCharacterRegex.test(password);
}

document.addEventListener("DOMContentLoaded", checkPassword);