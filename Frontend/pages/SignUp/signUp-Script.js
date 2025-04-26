// Form validation
const form = document.querySelector("form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userTypeSelect = document.getElementById("user-type");
const termsCheckbox = document.getElementById("terms");
const submitButton = form.querySelector('button[type="submit"]');

// Password strength indicator
passwordInput.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;

    // Check for length
    if (password.length >= 8) strength++;
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;
    // Check for numbers
    if (/[0-9]/.test(password)) strength++;
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Visual feedback for password strength
    const strengthText = document.querySelector(".mt-2.text-xs.text-gray-500");
    if (strength === 0) {
        strengthText.textContent = "Must be at least 8 characters";
        strengthText.className = "mt-2 text-xs text-gray-500";
    } else if (strength === 1) {
        strengthText.textContent = "Weak password";
        strengthText.className = "mt-2 text-xs text-red-500";
    } else if (strength === 2) {
        strengthText.textContent = "Medium password";
        strengthText.className = "mt-2 text-xs text-yellow-500";
    } else if (strength === 3) {
        strengthText.textContent = "Strong password";
        strengthText.className = "mt-2 text-xs text-green-500";
    } else {
        strengthText.textContent = "Very strong password";
        strengthText.className = "mt-2 text-xs text-green-700";
    }
});

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form validation function
function validateForm() {
    let isValid = true;

    // Validate first name
    if (!firstNameInput.value.trim()) {
        highlightError(firstNameInput, "First name is required");
        isValid = false;
    } else {
        removeError(firstNameInput);
    }

    // Validate last name
    if (!lastNameInput.value.trim()) {
        highlightError(lastNameInput, "Last name is required");
        isValid = false;
    } else {
        removeError(lastNameInput);
    }

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
    } else if (passwordInput.value.length < 8) {
        highlightError(passwordInput, "Password must be at least 8 characters");
        isValid = false;
    } else {
        removeError(passwordInput);
    }

    // Validate terms checkbox
    if (!termsCheckbox.checked) {
        const termsLabel = document.querySelector('label[for="terms"]');
        termsLabel.classList.add("text-red-500");
        isValid = false;
    } else {
        const termsLabel = document.querySelector('label[for="terms"]');
        termsLabel.classList.remove("text-red-500");
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
function collectFormData() {
    return {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        userType: userTypeSelect.value,
        termsAgreed: termsCheckbox.checked
    };
}

// Toggle password visibility function
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

// Add password toggle button
const passwordContainer = passwordInput.parentElement;
const toggleButton = document.createElement("button");
toggleButton.type = "button";
toggleButton.className = "absolute inset-y-0 right-0 pr-3 flex items-center";
toggleButton.innerHTML = '<i class="fas fa-eye text-gray-400"></i>';
toggleButton.addEventListener("click", togglePasswordVisibility);
passwordContainer.appendChild(toggleButton);

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const userData = collectFormData();

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';

    // Send data to backend via services
    import('./signup-services.js')
        .then(module => {
            return module.registerUser(userData);
        })
        .then(response => {
            if (response.success) {
                alert("Account created successfully! Redirecting to dashboard...");
                // Redirect to dashboard or show success message
                // window.location.href = '/dashboard';
            } else {
                alert(`Registration failed: ${response.message}`);
                submitButton.disabled = false;
                submitButton.innerHTML = 'Create Account';
            }
        })
        .catch(error => {
            console.error("Registration error:", error);
            alert("An error occurred during registration. Please try again.");
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
        });
});