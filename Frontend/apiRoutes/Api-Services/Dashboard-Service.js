const API_BASE = "http://localhost:8000";

const token = localStorage.getItem("auth_token");
const userData = JSON.parse(localStorage.getItem("user_data"));
if (!userData) throw new Error("User data not found in localStorage");

const { role } = userData; // Access role from user data
const check = localStorage.getItem("user_data"); // Ensure token is in localStorage

export const DashboardApiService = {
  // Get statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      if (!response.ok) throw new Error(`Stats Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to get stats:", error);
      return { success: false, error: error.message };
    }
  },

  // Get companies list
  async getCompanies() {
    try {
      const response = await fetch(`${API_BASE}/companies`);

      // console.log("Company list Response:", response); // Debugging line
      if (!response.ok) throw new Error(`Companies Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to get companies:", error);
      return { success: false, error: error.message };
    }
  },

  // Get internships
  async getInternships() {
    try {
      const response = await fetch(`${API_BASE}/internships`);
      console.log("Coming Internships Response:", response); // Debugging line
      if (!response.ok)
        throw new Error(`Internships Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to get internships:", error);
      return { success: false, error: error.message };
    }
  },
  // create a new company
  async createCompany(companyData) {
    console.log("Creating company with data:", companyData);

    // Debugging line
    const response = await fetch(`${API_BASE}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyData),
    });

    console.log("Create Company Response :::::::::::", response.status); // Debugging line
    console.log("Create Company Response :::::::::::", response); // Debugging line

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Unknown error");
    }

    return response.json();
  },

  // Create new internship
  async createInternship(internshipData) {
    try {
      console.log("Creating internship with data:", internshipData); // Debugging line

      if (!check) throw new Error("No authorization token found");
      if (role !== "admin")
        throw new Error("Only admin can create internships");

      const response = await fetch(`${API_BASE}/internships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token here
        },
        body: JSON.stringify(internshipData),
      });
      // const rawText = await response.text();
      // console.log("Raw response:", rawText);
      console.log("Creating Responces :::::::::::", response);
      if (!response.ok) throw new Error(`Create Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to create internship:", error);
      return { success: false, error: error.message };
    }
  },

  // Function to fetch user by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`);

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      console.log("User Data", data);
      return data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; // Propagate the error for further handling
    }
  },

  // Delete an internship
  async deleteInternship(internshipId) {
    try {
      const response = await fetch(`${API_BASE}/internships/${internshipId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token here
        },
      });
      if (!response.ok) throw new Error(`Delete Error: ${response.status}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete internship:", error);
      return { success: false, error: error.message };
    }
  },
};
