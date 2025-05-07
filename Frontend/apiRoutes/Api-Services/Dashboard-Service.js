const API_BASE = "http://localhost:8000";

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
      if (!response.ok)
        throw new Error(`Internships Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to get internships:", error);
      return { success: false, error: error.message };
    }
  },

  // Create new internship
  async createInternship(internshipData) {
    try {
      console.log("Creating internship with data:", internshipData); // Debugging line

      const token = localStorage.getItem("auth_token");
      const userData = JSON.parse(localStorage.getItem("user_data"));
      if (!userData) throw new Error("User data not found in localStorage");

      const { role } = userData; // Access role from user data
      const check = localStorage.getItem("user_data"); // Ensure token is in localStorage

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
      const rawText = await response.text();
      console.log("Raw response:", rawText);
      console.log("Creating Responces :::::::::::", response);
      if (!response.ok) throw new Error(`Create Error: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Failed to create internship:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete an internship
  async deleteInternship(internshipId) {
    try {
      const response = await fetch(`${API_BASE}/internships/${internshipId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Delete Error: ${response.status}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete internship:", error);
      return { success: false, error: error.message };
    }
  },
};
