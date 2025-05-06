/**
 * InternHub Signup Services
 * This file handles all API calls related to user registration
 */

console.log("✅ SignUp-Service.js loaded");
// API endpoint for user registration
const API_BASE_URL = "http://localhost:8000"; // Replace with your actual API URL
const REGISTER_ENDPOINT = "/users";

/**
 * Register a new user
 * @param {Object} userData - User data from the form
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.userType - Type of user (student or admin)
 * @param {boolean} userData.termsAgreed - Whether user agreed to terms
 * @returns {Promise<Object>} - Response from the server
 */
export async function registerUser(userData) {
  try {
    console.log("Incoming user data:", userData);

    // Validate required fields
    const requiredFields = ["first_name", "last_name", "email", "password"];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        errors: {
          ...missingFields.reduce((acc, field) => {
            acc[field] = [`${field.replace(/_/g, " ")} is required`];
            return acc;
          }, {}),
        },
      };
    }

    if (!userData.terms_agreed) {
      return {
        success: false,
        message: "You must agree to the Terms of Service and Privacy Policy",
        errors: {
          terms: ["You must agree to the terms"],
        },
      };
    }

    console.log("Sending registration request:", userData);

    const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Registration failed:", data);
      return {
        success: false,
        message: data.message || "Registration failed",
        errors: data.errors || {},
      };
    }

    // Store auth token if provided
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      console.log("Auth token stored");
    }

    return {
      success: true,
      message: "Registration successful",
      user: data.user || null,
    };
  } catch (error) {
    console.error("Registration service error:", error);
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - Whether email is available
 */
export async function checkEmailAvailability(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    return {
      available: data.available || false,
      message: data.message || "",
    };
  } catch (error) {
    console.error("Email check error:", error);
    return {
      available: false,
      message: "Unable to verify email availability",
    };
  }
}

/**
 * Log in a user after registration (optional)
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Login response
 */
export async function loginAfterRegistration(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // Store auth token
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }

    return {
      success: true,
      message: "Login successful",
      user: data.user || null,
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login",
    };
  }
}
