// Browse-Service.js - Handles API communication for the browse page
const baseUrl = "http://localhost:8000";

/**
 * Fetch all internships
 * @returns {Promise<Array>} Promise that resolves to array of internships
 */
export async function fetchInternships() {
  try {
    const response = await fetch(`${baseUrl}/internships`);
    if (!response.ok) {
      throw new Error("Failed to fetch internships");
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching internships:", error);
    throw error;
  }
}

/**
 * Fetch internships with filters applied
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Promise that resolves to filtered internships
 */
export async function fetchFilteredInternships(filters) {
  try {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    if (filters.searchTerm) queryParams.append("search", filters.searchTerm);
    if (filters.jobTypes?.length)
      queryParams.append("type", filters.jobTypes.join(","));
    if (filters.locations?.length)
      queryParams.append("location", filters.locations.join(","));
    if (filters.industries?.length)
      queryParams.append("category", filters.industries.join(","));
    if (filters.experienceLevels?.length)
      queryParams.append("experience", filters.experienceLevels.join(","));
    if (filters.minSalary) queryParams.append("min_salary", filters.minSalary);
    if (filters.maxSalary) queryParams.append("max_salary", filters.maxSalary);
    if (filters.sortBy) queryParams.append("sort", filters.sortBy);

    const response = await fetch(
      `${baseUrl}/internships?${queryParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch filtered internships");
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching filtered internships:", error);
    throw error;
  }
}

/**
 * Fetch internships for a specific page
 * @param {number} page - Page number
 * @param {number} itemsPerPage - Items per page
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} Promise that resolves to paginated internships
 */
export async function fetchPaginatedInternships(
  page,
  itemsPerPage,
  filters = {}
) {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append("page", page);
    queryParams.append("per_page", itemsPerPage);

    // Add filters to query params
    if (filters.searchTerm) queryParams.append("search", filters.searchTerm);
    if (filters.jobTypes?.length)
      queryParams.append("type", filters.jobTypes.join(","));
    if (filters.locations?.length)
      queryParams.append("location", filters.locations.join(","));
    if (filters.industries?.length)
      queryParams.append("category", filters.industries.join(","));
    if (filters.experienceLevels?.length)
      queryParams.append("experience", filters.experienceLevels.join(","));
    if (filters.minSalary) queryParams.append("min_salary", filters.minSalary);
    if (filters.maxSalary) queryParams.append("max_salary", filters.maxSalary);
    if (filters.sortBy) queryParams.append("sort", filters.sortBy);

    const response = await fetch(
      `${baseUrl}/internships?${queryParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch paginated internships");
    }
    const data = await response.json();

    // Ensure we have valid data
    const internships = Array.isArray(data.data) ? data.data : [];
    const total = parseInt(data.total) || 0;

    return {
      internships,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / itemsPerPage),
        totalItems: total,
        itemsPerPage,
        startIndex: total > 0 ? (page - 1) * itemsPerPage + 1 : 0,
        endIndex: Math.min(page * itemsPerPage, total),
      },
    };
  } catch (error) {
    console.error("Error fetching paginated internships:", error);
    throw error;
  }
}

/**
 * Submit newsletter subscription
 * @param {string} email - Email address
 * @returns {Promise<Object>} Promise that resolves to subscription result
 */
export async function submitNewsletterSubscription(email) {
  try {
    const response = await fetch(`${baseUrl}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to subscribe to newsletter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
}

/**
 * Apply for an internship
 * @param {number} internshipId - ID of the internship
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} Promise that resolves to application result
 */
export async function applyForInternship(internshipId, applicationData) {
  try {
    const response = await fetch(
      `${baseUrl}/internships/${internshipId}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to apply for internship");
    }

    return await response.json();
  } catch (error) {
    console.error("Error applying for internship:", error);
    throw error;
  }
}

/**
 * Toggle bookmark status for an internship
 * @param {number} internshipId - ID of the internship
 * @param {boolean} isBookmarked - Current bookmark status
 * @returns {Promise<Object>} Promise that resolves to bookmark result
 */
export async function toggleBookmark(internshipId, isBookmarked) {
  try {
    const response = await fetch(
      `${baseUrl}/internships/${internshipId}/bookmark`,
      {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle bookmark");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
