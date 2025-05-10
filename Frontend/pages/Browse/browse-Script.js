import {
  fetchInternships,
  fetchFilteredInternships,
  fetchPaginatedInternships,
  submitNewsletterSubscription,
  toggleBookmark,
  applyForInternship,
  isValidEmail,
} from "../../apiRoutes/Api-Services/Browse-Service.js";

// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the page
  let currentPage = 1;
  const itemsPerPage = 6;
  let filteredInternships = [];

  // DOM elements
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const internshipCardsContainer = document.getElementById("internship-cards");
  const appliedFiltersContainer = document.getElementById("applied-filters");
  const resetFiltersButton = document.getElementById("reset-filters");
  const sortSelect = document.getElementById("sort-select");
  const salaryRange = document.getElementById("salary-range");
  const salaryDisplay = document.getElementById("salary-display");
  const paginationNumbers = document.getElementById("pagination-numbers");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const resultsCountStart = document.getElementById("results-count-start");
  const resultsCountEnd = document.getElementById("results-count-end");
  const resultsCountTotal = document.getElementById("results-count-total");
  const noResultsMessage = document.getElementById("no-results");

  // Filter elements
  const filterToggles = document.querySelectorAll(".filter-toggle");
  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
  const jobTypeCheckboxes = document.querySelectorAll(".job-type-checkbox");
  const locationCheckboxes = document.querySelectorAll(".location-checkbox");
  const industryCheckboxes = document.querySelectorAll(".industry-checkbox");
  const experienceCheckboxes = document.querySelectorAll(
    ".experience-checkbox"
  );

  // Initialize the page
  initializeFilters();
  loadInternships();

  // Event listeners
  searchButton.addEventListener("click", handleSearch);

  // Make search work without hitting the search button
  searchInput.addEventListener("input", function () {
    // Add debounce to avoid too many requests
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500);
  });

  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  resetFiltersButton.addEventListener("click", resetFilters);
  sortSelect.addEventListener("change", handleSort);
  salaryRange.addEventListener("input", handleSalaryChange);

  prevPageButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      loadInternships();
    }
  });

  nextPageButton.addEventListener("click", function (e) {
    e.preventDefault();
    const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      loadInternships();
    }
  });

  // Toggle filter sections
  filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const section = this.nextElementSibling;
      section.classList.toggle("expanded");
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");
    });
  });

  // Expand all filter sections by default
  document.querySelectorAll(".filter-section").forEach((section) => {
    section.classList.add("expanded");
  });

  // Add event listeners to all filter checkboxes
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      applyFilters();
    });
  });

  // Functions
  function initializeFilters() {
    // Set initial salary range
    updateSalaryDisplay(salaryRange.value);

    // Add any initial applied filters
    updateAppliedFilters();
  }

  async function loadInternships() {
    // Show loading state
    disableInteractions();

    try {
      // Get filter values
      const filters = getFilterValues();

      // Fetch paginated internships from API
      const result = await fetchPaginatedInternships(
        currentPage,
        itemsPerPage,
        filters
      );

      // Update UI with results
      renderInternships(result.internships);
      updatePagination(result.pagination);
      updateResultsCount(result.pagination);

      // Store the total filtered internships count
      filteredInternships = await fetchFilteredInternships(filters);

      // Show no results message if needed
      if (result.internships.length === 0) {
        showNoResultsMessage();
      } else {
        hideNoResultsMessage();
      }
    } catch (error) {
      console.error("Error loading internships:", error);
      showErrorMessage("Failed to load internships. Please try again later.");
    } finally {
      // Re-enable interactions
      enableInteractions();
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadInternships();
  }

  function handleSort() {
    loadInternships();
  }

  function handleSalaryChange() {
    updateSalaryDisplay(salaryRange.value);

    // Add debounce to avoid too many requests
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      applyFilters();
    }, 300);
  }

  function updateSalaryDisplay(value) {
    const minSalary = Math.floor(value * 0.7);
    const maxSalary = Math.floor(value * 1.7);
    salaryDisplay.textContent = `$${minSalary} - $${maxSalary} /hr`;
  }

  function resetFilters() {
    // Reset checkboxes
    filterCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Reset salary range
    salaryRange.value = 30;
    updateSalaryDisplay(30);

    // Reset search
    searchInput.value = "";

    // Reset sort
    sortSelect.value = "relevant";

    // Apply filters (which will now show all internships)
    applyFilters();
  }

  function applyFilters() {
    currentPage = 1;
    loadInternships();
    updateAppliedFilters();
  }

  function getFilterValues() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const jobTypes = getSelectedValues(jobTypeCheckboxes);
    const locations = getSelectedValues(locationCheckboxes);
    const industries = getSelectedValues(industryCheckboxes);
    const experienceLevels = getSelectedValues(experienceCheckboxes);
    const salaryValue = parseInt(salaryRange.value);
    const minSalary = Math.floor(salaryValue * 0.7);
    const maxSalary = Math.floor(salaryValue * 1.7);
    const sortBy = sortSelect.value;

    return {
      searchTerm,
      jobTypes,
      locations,
      industries,
      experienceLevels,
      minSalary,
      maxSalary,
      sortBy,
    };
  }

  function getSelectedValues(checkboxes) {
    return Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  function updateAppliedFilters() {
    if (!appliedFiltersContainer) return;

    // Clear existing filters
    appliedFiltersContainer.innerHTML = "";

    // Get all selected filters
    const filters = getFilterValues();

    // Add search term if present
    if (filters.searchTerm) {
      addAppliedFilter(filters.searchTerm, "search");
    }

    // Add job types
    filters.jobTypes.forEach((type) => {
      addAppliedFilter(type, "jobType");
    });

    // Add locations
    filters.locations.forEach((location) => {
      addAppliedFilter(location, "location");
    });

    // Add industries
    filters.industries.forEach((industry) => {
      addAppliedFilter(industry, "industry");
    });

    // Add experience levels
    filters.experienceLevels.forEach((level) => {
      addAppliedFilter(level, "experience");
    });

    // Add salary range
    if (filters.minSalary > 0 || filters.maxSalary < 100) {
      addAppliedFilter(
        `$${filters.minSalary} - $${filters.maxSalary}`,
        "salary"
      );
    }
  }

  function addAppliedFilter(filterText, filterType) {
    const filterElement = document.createElement("div");
    filterElement.className =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2";
    filterElement.innerHTML = `
            ${filterText}
            <button class="ml-2 text-indigo-600 hover:text-indigo-800" data-filter-type="${filterType}" data-filter-value="${filterText}">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add click handler to remove filter
    const removeButton = filterElement.querySelector("button");
    removeButton.addEventListener("click", function () {
      removeFilter(filterText, filterType);
    });

    appliedFiltersContainer.appendChild(filterElement);
  }

  function removeFilter(filterText, filterType) {
    // Remove the filter from the appropriate checkbox
    const checkboxes = document.querySelectorAll(`.${filterType}-checkbox`);
    checkboxes.forEach((checkbox) => {
      if (checkbox.value === filterText) {
        checkbox.checked = false;
      }
    });

    // Reapply filters
    applyFilters();
  }

  function renderInternships(internships) {
    if (!internshipCardsContainer) return;

    // Clear existing content
    internshipCardsContainer.innerHTML = "";

    // Create and append internship cards
    internships.forEach((internship) => {
      const card = createInternshipCard(internship);
      internshipCardsContainer.appendChild(card);
    });
  }

  function createInternshipCard(internship) {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover search-card";

    // Format salary range
    const salaryRange = internship.salary_range || "Not specified";

    // Format company name for logo
    const companyName = internship.company || "Company";
    const logoUrl = `https://logo.clearbit.com/${companyName
      .toLowerCase()
      .replace(/\s+/g, "")}.com`;

    // Create a fallback image using initials
    const initials = companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" fill="#E5E7EB"/>
                <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#4B5563" text-anchor="middle" dy=".3em">${initials}</text>
            </svg>
        `)}`;

    // Format job type
    const jobType = internship.type || "Not specified";
    const location = internship.location || "Remote";
    const category = internship.category || "General";
    const description = internship.description || "No description available";
    const postedDate = formatDate(internship.created_at);

    card.innerHTML = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                    <img src="${logoUrl}" alt="${companyName}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='${fallbackImage}'">
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-900">${internship.title}</h3>
                        <p class="text-sm text-gray-600">${companyName}</p>
                    </div>
                </div>
                <button onclick="handleBookmarkToggle(${internship.id}, false)" class="text-gray-400 hover:text-yellow-500">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 tag-hover cursor-pointer">
                    ${jobType}
                </span>
                <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 tag-hover cursor-pointer">
                    ${salaryRange}
                </span>
                <span class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 tag-hover cursor-pointer">
                    ${category}
                </span>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-600 line-clamp-3">
                    ${description}
                </p>
            </div>
            <div class="mt-4 flex items-center text-sm text-gray-500">
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span>${location}</span>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                    <i class="far fa-clock mr-2"></i>
                    <span>Posted ${postedDate}</span>
                </div>
                <button onclick="handleApplyClick(${internship.id}, '${companyName}', '${internship.title}')" class="apply-btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                    Apply Now
                </button>
            </div>
        </div>
    `;
    return card;
  }

  function updatePagination(pagination) {
    if (!paginationNumbers) return;

    // Clear existing pagination numbers
    paginationNumbers.innerHTML = "";

    // Add previous page button
    prevPageButton.disabled = pagination.currentPage === 1;

    // Add page numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.className = `px-3 py-1 rounded-md text-sm font-medium ${
        i === pagination.currentPage
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`;
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        loadInternships();
      });
      paginationNumbers.appendChild(pageButton);
    }

    // Add next page button
    nextPageButton.disabled = pagination.currentPage === pagination.totalPages;
  }

  function updateResultsCount(pagination) {
    if (!resultsCountStart || !resultsCountEnd || !resultsCountTotal) return;

    resultsCountStart.textContent = pagination.startIndex;
    resultsCountEnd.textContent = pagination.endIndex;
    resultsCountTotal.textContent = pagination.totalItems;
  }

  function disableInteractions() {
    // Disable all interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, input, select"
    );
    interactiveElements.forEach((element) => {
      element.disabled = true;
    });
  }

  function enableInteractions() {
    // Re-enable all interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, input, select"
    );
    interactiveElements.forEach((element) => {
      element.disabled = false;
    });
  }

  function showNoResultsMessage() {
    if (!noResultsMessage) return;
    noResultsMessage.classList.remove("hidden");
  }

  function hideNoResultsMessage() {
    if (!noResultsMessage) return;
    noResultsMessage.classList.add("hidden");
  }

  function showErrorMessage(message) {
    // Create error message element
    const errorElement = document.createElement("div");
    errorElement.className =
      "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";
    errorElement.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;

    // Add to document
    document.body.appendChild(errorElement);

    // Remove after 5 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  // Helper function to format dates
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // Make functions available globally for onclick handlers
  window.handleBookmarkToggle = async function (internshipId, isBookmarked) {
    try {
      const result = await toggleBookmark(internshipId, isBookmarked);
      if (result.success) {
        // Update the bookmark icon
        const bookmarkButton = document.querySelector(
          `button[onclick="handleBookmarkToggle(${internshipId}, ${isBookmarked})"]`
        );
        if (bookmarkButton) {
          const icon = bookmarkButton.querySelector("i");
          icon.classList.toggle("far");
          icon.classList.toggle("fas");
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showErrorMessage("Failed to update bookmark. Please try again.");
    }
  };

  window.handleApplyClick = async function (
    internshipId,
    companyName,
    internshipTitle
  ) {
    try {
      // Store the internship data in localStorage
      const internshipData = {
        id: internshipId,
        company: companyName,
        title: internshipTitle,
      };
      localStorage.setItem(
        "selectedInternship",
        JSON.stringify(internshipData)
      );

      // Redirect to the application page
      window.location.href =
        "../InternDashboard/Intern-Dashboard.html#my-applications";
    } catch (error) {
      console.error("Error handling apply click:", error);
      showErrorMessage("Failed to process application. Please try again.");
    }
  };

  function showSuccessMessage(message) {
    // Create success message element
    const successElement = document.createElement("div");
    successElement.className =
      "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded";
    successElement.innerHTML = `
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline">${message}</span>
        `;

    // Add to document
    document.body.appendChild(successElement);

    // Remove after 5 seconds
    setTimeout(() => {
      successElement.remove();
    }, 5000);
  }
});
