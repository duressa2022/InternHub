import { registerUser } from "../../apiRoutes/Api-Services/SignUp-Service.js";

// Get form elements
const form = document.querySelector("form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const termsCheckbox = document.getElementById("terms");
const roleInput = document.getElementById("role");
const submitButton = document.querySelector('button[type="submit"]');

// Password visibility toggle
const passwordToggle = document.querySelector(".password-toggle");
if (passwordToggle) {
  passwordToggle.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
}

// Form validation
function validateForm() {
  let isValid = true;
  const errors = {};

  // First Name validation
  if (!firstNameInput.value.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  } else if (firstNameInput.value.trim().length > 100) {
    errors.firstName = "First name must be less than 100 characters";
    isValid = false;
  }

  // Last Name validation
  if (!lastNameInput.value.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  } else if (lastNameInput.value.trim().length > 100) {
    errors.lastName = "Last name must be less than 100 characters";
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  } else if (emailInput.value.trim().length > 255) {
    errors.email = "Email must be less than 255 characters";
    isValid = false;
  }

  // Role validation
  if (!roleInput.value) {
    errors.role = "Please select your role";
    isValid = false;
  }

  // Password validation
  if (!passwordInput.value || passwordInput.value.length < 8) {
    errors.password = "Password must be at least 8 characters long";
    isValid = false;
  }

  // Terms checkbox validation
  if (!termsCheckbox.checked) {
    errors.terms = "You must agree to the terms and conditions";
    isValid = false;
  }

  // Display errors if any
  Object.keys(errors).forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      const errorElement =
        element.parentElement.querySelector(".error-message");
      if (errorElement) {
        errorElement.textContent = errors[field];
      } else {
        const error = document.createElement("p");
        error.className = "error-message text-red-500 text-sm mt-1";
        error.textContent = errors[field];
        element.parentElement.appendChild(error);
      }
    }
  });

  return isValid;
}

// Form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  if (!validateForm()) return;

  const userData = {
    first_name: firstNameInput.value.trim(),
    last_name: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    role: roleInput.value,
    terms_agreed: termsCheckbox.checked,
  };

  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';

  try {
    console.log("Submitting user data:", userData);
    const response = await registerUser(userData);
    console.log("Registration response:", response);

    if (response.success) {
      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4";
      successMessage.innerHTML = `
        <strong class="font-bold">Success!</strong>
        <span class="block sm:inline"> Account created successfully!</span>
      `;
      form.appendChild(successMessage);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "../Login/login.html";
      }, 2000);
    } else {
      // Handle field-specific errors
      const errors = response.errors || {};
      Object.keys(errors).forEach((field) => {
        const element = document.getElementById(field);
        if (element) {
          const error = document.createElement("p");
          error.className = "error-message text-red-500 text-sm mt-1";
          error.textContent = errors[field][0];
          element.parentElement.appendChild(error);
        }
      });

      // Show general error message if no field-specific errors
      if (Object.keys(errors).length === 0) {
        const errorMessage = document.createElement("div");
        errorMessage.className =
          "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4";
        errorMessage.innerHTML = `
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> ${
            response.message || "Registration failed. Please try again."
          }</span>
        `;
        form.appendChild(errorMessage);
      }
    }
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = document.createElement("div");
    errorMessage.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4";
    errorMessage.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> ${
        err.message || "An unexpected error occurred. Please try again."
      }</span>
    `;
    form.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "Create Account";
  }
});
