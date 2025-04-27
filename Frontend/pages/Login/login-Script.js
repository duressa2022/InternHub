// Form validation
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const rememberMeCheckbox = document.getElementById("remember-me");
const submitButton = form.querySelector('button[type="submit"]');

// Toggle password visibility
togglePassword.addEventListener("click", function () {
    const type =
        passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
    passwordInput.setAttribute("type", type);
    this.querySelector("i").classList.toggle("fa-eye");
    this.querySelector("i").classList.toggle("fa-eye-slash");
});

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form validation function
function validateForm() {
    let isValid = true;

    // Validate email
    if (!emailInput.value.trim()) {
        highlightError(emailInput, "Email is required");
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        highlightError(emailInput, "Please enter a valid email address");
        isValid = false;
    } else {
        removeError(emailInput);
    }

    // Validate password
    if (!passwordInput.value) {
        highlightError(passwordInput, "Password is required");
        isValid = false;
    } else {
        removeError(passwordInput);
    }

    return isValid;
}

// Helper function to highlight error
function highlightError(inputElement, errorMessage) {
    inputElement.classList.add("border-red-500");
    inputElement.classList.remove("border-gray-300");

    // Check if error message element already exists
    let errorElement = inputElement.parentElement.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("p");
        errorElement.className = "error-message text-xs text-red-500 mt-1";
        inputElement.parentElement.parentElement.insertBefore(errorElement, inputElement.parentElement.nextElementSibling);
    }

    errorElement.textContent = errorMessage;
}

// Helper function to remove error
function removeError(inputElement) {
    inputElement.classList.remove("border-red-500");
    inputElement.classList.add("border-gray-300");

    // Remove error message if it exists
    const errorElement = inputElement.parentElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.remove();
    }
}

// Function to collect form data
function collectLoginData() {
    return {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        rememberMe: rememberMeCheckbox.checked
    };
}

// Add input validation styling
emailInput.addEventListener("input", function () {
    if (this.value.trim() && isValidEmail(this.value.trim())) {
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
        removeError(this);
    }
});

passwordInput.addEventListener("input", function () {
    if (this.value) {
        this.classList.remove("border-red-500");
        this.classList.add("border-gray-300");
        removeError(this);
    }
});

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Collect login data
    const loginData = collectLoginData();

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

    // Send data to backend via services
    import('../../apiRoutes/Api-Services/Login-Service.js')
        .then(module => {
            return module.loginUser(loginData);
        })
        .then(response => {
            if (response.success) {
                // Handle successful login
                if (response.redirectUrl) {
                    window.location.href = response.redirectUrl;
                } else {
                    window.location.href = '/dashboard'; // Default redirect
                }
            } else {
                // Handle login failure
                alert(response.message || "Login failed. Please check your credentials.");
                submitButton.disabled = false;
                submitButton.innerHTML = 'Log In';
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
            submitButton.disabled = false;
            submitButton.innerHTML = 'Log In';
        });
});

// Handle "Enter" key press
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !submitButton.disabled) {
        // Trigger form submission when Enter key is pressed
        form.dispatchEvent(new Event('submit'));
    }
});