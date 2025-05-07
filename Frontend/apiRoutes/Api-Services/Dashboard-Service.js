const API_BASE = "http://localhost:8000"; // this is a placeholder, we will replace with actual API endpoint

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
      const response = await fetch(`${API_BASE}/internships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(internshipData),
      });
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
