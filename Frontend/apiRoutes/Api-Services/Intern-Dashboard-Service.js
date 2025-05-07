class DashboardAPI {
  constructor() {
    this.baseUrl = "http://our-api-domain.com/api";
  }

  async _fetch(endpoint, method = "GET", body = null) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // User Endpoints
  async getCurrentUser() {
    return this._fetch("users/me");
  }

  // Application Endpoints
  async getApplicationsStats(userId) {
    return this._fetch(`applications/stats/${userId}`);
  }

  async getRecentApplications(userId, limit = 5) {
    return this._fetch(`applications/information/${userId}?limit=${limit}`);
  }

  // Company Endpoints
  async getTopCompanies(limit = 5) {
    return this._fetch(`companies?sort=rating&limit=${limit}`);
  }

  // Internship Endpoints
  async searchInternships(queryParams) {
    const params = new URLSearchParams(queryParams).toString();
    return this._fetch(`internships/search?${params}`);
  }

  // Review Endpoints
  async createReview(reviewData) {
    return this._fetch("reviews", "POST", reviewData);
  }
}

export const dashboardAPI = new DashboardAPI();
