const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("auth_token");
console.log("Token:", token); // Debugging line
const userData = JSON.parse(localStorage.getItem("user_data"));

console.log("User Data:", userData.role); // Debugging line
export const InternDashboardService = {
  // User Endpoints
  async getCurrentUser() {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data"));
      if (!userData?.id) {
        throw new Error("User not logged in");
      }

      const response = await fetch(`${API_BASE}/users/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`User Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get current user:", error);
      return { success: false, error: error.message };
    }
  },

  // Application Endpoints
  async getApplicationsStats(userId) {
    try {
      const response = await fetch(`${API_BASE}/applications/stats/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Stats Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get application stats:", error);
      return { success: false, error: error.message };
    }
  },

  async getRecentApplications(userId, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE}/applications/by-user/${userId}?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Applications Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get recent applications:", error);
      return { success: false, error: error.message };
    }
  },

  async createApplication(applicationData) {
    try {
      console.log("Creating application with data:", applicationData);
      const response = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.role}`,
        },
        body: JSON.stringify(applicationData),
      });

      console.log("Application creation response status:", response.status);
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Application Creation Error: ${response.status} - ${responseText}`
        );
      }

      const data = JSON.parse(responseText);
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to create application:", error);
      return { success: false, error: error.message };
    }
  },

  async getApplications(userId) {
    try {
      const response = await fetch(`${API_BASE}/applications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`Applications Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get applications:", error);
      return { success: false, error: error.message };
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await fetch(
        `${API_BASE}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok)
        throw new Error(`Status Update Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to update application status:", error);
      return { success: false, error: error.message };
    }
  },

  async withdrawApplication(applicationId) {
    try {
      const response = await fetch(
        `${API_BASE}/applications/${applicationId}/withdraw`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`Withdrawal Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to withdraw application:", error);
      return { success: false, error: error.message };
    }
  },

  // Company Endpoints
  async getTopCompanies(limit = 5) {
    try {
      const response = await fetch(
        `${API_BASE}/companies?sort=rating&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`Companies Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get top companies:", error);
      // Return mock data if API fails
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Google",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
          },
          {
            id: 2,
            name: "Microsoft",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
          },
          {
            id: 3,
            name: "Amazon",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
          },
          {
            id: 4,
            name: "Meta",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png",
          },
          {
            id: 5,
            name: "Apple",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
          },
        ],
      };
    }
  },

  async getCompanyInternships(companyId) {
    try {
      const response = await fetch(
        `${API_BASE}/companies/${companyId}/internships`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Company Internships Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get company internships:", error);
      return { success: false, error: error.message };
    }
  },

  // Internship Endpoints
  async getInternshipDetails(internshipId) {
    try {
      const response = await fetch(`${API_BASE}/internships/${internshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`Internship Details Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to get internship details:", error);
      // Return mock data if API fails
      const companyLogos = {
        Google:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        Microsoft:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
        Amazon:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
        Meta: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png",
        Apple:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
        Netflix:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
        Twitter:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1200px-Logo_of_Twitter.svg.png",
        LinkedIn:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/1200px-LinkedIn_logo_initials.png",
        "Tech Corp":
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1200px-Microsoft_logo_%282012%29.svg.png",
        "StartUp Inc":
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
      };

      const company = "Google";
      return {
        success: true,
        data: {
          id: internshipId,
          company: company,
          company_id: 1,
          title: "Software Engineering Intern",
          type: "Full-time",
          location: "Mountain View, CA",
          category: "Engineering",
          description:
            "Join our team as a Software Engineering Intern and work on exciting projects that impact millions of users worldwide.",
          salary_range: "$45,000 - $65,000",
          created_at: "2024-02-15",
          company_logo: companyLogos[company],
          company_logos: companyLogos,
        },
      };
    }
  },

  async searchInternships(queryParams) {
    try {
      const params = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_BASE}/internships/search?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Search Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to search internships:", error);
      return { success: false, error: error.message };
    }
  },

  // Review Endpoints
  async createReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok)
        throw new Error(`Review Creation Error: ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("Failed to create review:", error);
      return { success: false, error: error.message };
    }
  },

  // File Upload Endpoint
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "File upload failed");
      }

      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("File Upload Error:", error);
      return { success: false, error: error.message };
    }
  },

  async updateUser(userId, data) {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Update failed");
    }
    return await response.json();
  },
};

// For backward compatibility
export const dashboardAPI = InternDashboardService;
