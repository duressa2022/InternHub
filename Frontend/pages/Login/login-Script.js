// Form validation
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
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

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    if (!emailInput.value || !passwordInput.value) {
        alert("Please fill in all fields");
        return;
    }

    // Simulate form submission
    submitButton.disabled = true;
    submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

    // In a real app, you would send the data to your backend here
    setTimeout(() => {
        alert("Login successful! Redirecting to dashboard...");
        // window.location.href = '/dashboard';
    }, 1500);
});

// Add input validation styling
emailInput.addEventListener("input", function () {
    if (this.validity.valid) {
        this.classList.remove("border-red-300");
        this.classList.add("border-gray-300");
    } else {
        this.classList.remove("border-gray-300");
        this.classList.add("border-red-300");
    }
});

passwordInput.addEventListener("input", function () {
    if (this.value.length >= 8) {
        this.classList.remove("border-red-300");
        this.classList.add("border-gray-300");
    } else {
        this.classList.remove("border-gray-300");
        this.classList.add("border-red-300");
    }
});