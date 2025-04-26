// Form validation
const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
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

    // Visual feedback could be added here
});

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!termsCheckbox.checked) {
        alert("Please agree to the Terms of Service and Privacy Policy");
        return;
    }

    // Simulate form submission
    submitButton.disabled = true;
    submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';

    // In a real app, you would send the data to your backend here
    setTimeout(() => {
        alert("Account created successfully! Redirecting to dashboard...");
        // window.location.href = '/dashboard';
    }, 1500);
});

// function togglePasswordVisibility() {
//     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwordInput.setAttribute('type', type);
// }