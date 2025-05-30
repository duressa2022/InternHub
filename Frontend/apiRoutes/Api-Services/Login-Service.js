/**
 * InternHub Login Services
 * This file handles all API calls related to user authentication
 */

// API endpoint for user authentication
const API_BASE_URL = "http://localhost:8000";
const LOGIN_ENDPOINT = "/users/login";

/**
 * Authenticate a user
 * @param {Object} loginData - User login data from the form
 * @param {string} loginData.email - User's email address
 * @param {string} loginData.password - User's password
 * @param {boolean} loginData.rememberMe - Whether to remember the user's session
 * @returns {Promise<Object>} - Response from the server
 */
export async function loginUser(loginData) {
  try {
    console.log("User Login information :", loginData);
    // Validate data before sending to API
    if (!loginData.email || !loginData.password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Format data for API
    const requestData = {
      email: loginData.email,
      password: loginData.password,
      remember_me: loginData.rememberMe || false,
    };

    // Make API request
    const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });

    // Parse response
    const responseData = await response.json();
    const data = responseData.data; // Extract data from response

    // Handle API response
    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || "Invalid email or password",
        errors: responseData.errors || {},
      };
    }

    // Store auth token if provided by API
    if (data.access_token) {
      localStorage.setItem("auth_token", data.access_token);

      // If remember me is checked, store in localStorage, otherwise in sessionStorage
      if (loginData.rememberMe) {
        localStorage.setItem("user_email", loginData.email);
      } else {
        sessionStorage.setItem("user_email", loginData.email);
        // Clear any previously remembered email
        localStorage.removeItem("user_email");
      }
    }

    let redirectUrl = "../../pages/Admin/admin-Dashboard.html"; // Default redirect

    if (data.user && data.user.role) {
      switch (data.user.role) {
        case "admin":
          redirectUrl = "../../pages/Admin/admin-Dashboard.html";
          break;
        case "student":
          redirectUrl = "../../pages/Home/HomePage.html";
          break;
        default:
          redirectUrl = "../../pages/Admin/admin-Dashboard.html";
      }
    }
    // console.log("Login successful:", data.user);
    // Only store non-sensitive user data
    if (data.user) {
      const { first_name, last_name, email, role, id } = data.user;
      localStorage.setItem(
        "user_data",
        JSON.stringify({ first_name, last_name, email, role, id })
      );
    }

    return {
      success: true,
      message: responseData.message || "Login successful",
      redirectUrl,
      user: data.user,
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Check if user is already logged in
 * @returns {boolean} - Whether user is logged in
 */
export function isLoggedIn() {
  return !!localStorage.getItem("auth_token");
}

/**
 * Log out the current user
 * @returns {Promise<Object>} - Logout response
 */
export async function logoutUser() {
  try {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      return {
        success: true,
        message: "No active session",
      };
    }

    // Make API request to logout
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Include cookies in the request
    });

    // Clear local storage regardless of API response
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    sessionStorage.removeItem("user_email");

    // Parse response if available
    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      // Ignore JSON parsing errors
    }

    return {
      success: true,
      message: data.message || "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout service error:", error);

    // Still clear local storage even if API call fails
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    sessionStorage.removeItem("user_email");

    return {
      success: true,
      message: "Logged out successfully (offline)",
    };
  }
}

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response from the server
 */
export async function requestPasswordReset(email) {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to send password reset email",
      };
    }

    return {
      success: true,
      message: data.message || "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Initialize login form with remembered email if available
 */
export function initLoginForm() {
  const rememberedEmail = localStorage.getItem("user_email");
  const emailInput = document.getElementById("email");
  const rememberMeCheckbox = document.getElementById("remember-me");

  if (rememberedEmail && emailInput) {
    emailInput.value = rememberedEmail;
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }

  // Check if user is already logged in
  if (isLoggedIn()) {
    // Optionally redirect to dashboard or show a message
    console.log("User is already logged in");
  }
}

// Initialize the form when this module is imported
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initLoginForm);
}
