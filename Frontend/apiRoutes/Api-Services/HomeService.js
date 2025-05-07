class HomeService {
  constructor() {
    // Update the base URL to point to your PHP backend
    this.baseUrl = "http://localhost:8000"; // Replace with your actual PHP backend URL
  }

  // Fetch all internships
  async getInternships() {
    try {
      const response = await fetch(`${this.baseUrl}/internships`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching internships:", error);
      throw error;
    }
  }

  // Search internships
  async searchInternships(query) {
    try {
      const response = await fetch(`${this.baseUrl}/search-internships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching internships:", error);
      throw error;
    }
  }

  // Filter internships
  async filterInternships(filters) {
    try {
      const response = await fetch(`${this.baseUrl}/filter-internships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error filtering internships:", error);
      throw error;
    }
  }
}

export default new HomeService();
