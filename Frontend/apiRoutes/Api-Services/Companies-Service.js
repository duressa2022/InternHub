const API_BASE_URL = "http://localhost:8000"; // Update this

export async function fetchAdditionalCompanies() {
  try {
    console.log("Fetching companies from:", `${API_BASE_URL}/companies`);
    const response = await fetch(`${API_BASE_URL}/companies`, {
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched companies:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchAdditionalCompanies:", error);
    throw error;
  }
}

export async function fetchCompaniesByFilter(filters) {
  try {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append("name", filters.searchTerm);
    if (filters.letter && filters.letter !== "All")
      params.append("letter", filters.letter);
    if (filters.industry) params.append("industry", filters.industry);
    if (filters.location) params.append("location", filters.location);
    if (filters.rating) params.append("rating", filters.rating);

    const response = await fetch(
      `${API_BASE_URL}/companies/search?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Filtered companies:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchCompaniesByFilter:", error);
    throw error;
  }
}



