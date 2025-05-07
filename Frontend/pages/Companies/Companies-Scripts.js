import {
  fetchAdditionalCompanies,
  fetchCompaniesByFilter,
} from "../../apiRoutes/Api-Services/Companies-Service.js";

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // ===== DOM ELEMENTS =====
  const companySearchInput = document.getElementById("companySearch");
  const alphabetFilter = document.getElementById("alphabetFilter");
  const companiesGrid = document.getElementById("companiesGrid");
  const noResultsMessage = document.getElementById("noResults");
  const loadMoreButton = document.querySelector(".load-more-btn");

  // Store companies data
  let existingCompanies = [];

  // Initialize the page
  loadAdditionalCompanies();

  // ===== EVENT LISTENERS =====
  if (companySearchInput) {
    companySearchInput.addEventListener(
      "input",
      debounce(filterCompanies, 300)
    );

    // Add clear button functionality
    const clearButton = document.querySelector(".clear-search");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        companySearchInput.value = "";
        clearButton.classList.add("hidden");
        filterCompanies();
      });
    }

    // Show/hide clear button based on input
    companySearchInput.addEventListener("input", () => {
      const clearButton = document.querySelector(".clear-search");
      if (clearButton) {
        clearButton.classList.toggle("hidden", !companySearchInput.value);
      }
    });
  }

  if (alphabetFilter) {
    const letters = alphabetFilter.querySelectorAll("li");
    letters.forEach((letter) => {
      letter.addEventListener("click", function () {
        // Remove active class from all letters
        letters.forEach((l) => {
          l.classList.remove("active", "bg-indigo-600", "text-white");
          l.classList.add("bg-gray-200");
        });

        // Add active class to clicked letter
        this.classList.remove("bg-gray-200");
        this.classList.add("active", "bg-indigo-600", "text-white");

        // Clear search input when changing alphabet filter
        if (companySearchInput) {
          companySearchInput.value = "";
          const clearButton = document.querySelector(".clear-search");
          if (clearButton) {
            clearButton.classList.add("hidden");
          }
        }

        // Get the selected letter
        const selectedLetter = this.textContent.trim();

        // If "All" is selected, load all companies
        if (selectedLetter === "All") {
          loadAdditionalCompanies();
        } else {
          // Otherwise, filter by the selected letter
          filterCompanies();
        }
      });
    });
  }

  async function loadAdditionalCompanies() {
    try {
      // Show loading state
      companiesGrid.innerHTML = "";
      noResultsMessage.textContent = "Loading companies...";
      noResultsMessage.style.display = "block";

      const response = await fetchAdditionalCompanies();
      const initialCompanies = response.data; // Access the data array

      if (!initialCompanies || initialCompanies.length === 0) {
        noResultsMessage.textContent = "No companies available.";
        noResultsMessage.style.display = "block";
        return;
      }

      companiesGrid.innerHTML = "";
      existingCompanies = [];

      initialCompanies.forEach((company) => {
        const newCard = createCompanyCard({
          id: company.id,
          name: company.name,
          logo: company.logoUrl,
          rating: company.rating,
          industry: company.category,
          location: company.location,
          description: company.about,
          openInternships: company.currentNumberOfInternships,
        });

        companiesGrid.appendChild(newCard);
        existingCompanies.push({
          element: newCard,
          name: company.name,
          firstLetter: company.name.charAt(0).toUpperCase(),
        });
      });

      noResultsMessage.style.display = "none";

      if (loadMoreButton) {
        loadMoreButton.disabled = false;
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      noResultsMessage.textContent =
        "Failed to load companies. Please try again later.";
      noResultsMessage.style.display = "block";

      if (loadMoreButton) {
        loadMoreButton.disabled = true;
      }
    }
  }

  async function filterCompanies() {
    if (!companiesGrid) return;

    try {
      // Show loading state
      noResultsMessage.textContent = "Loading companies...";
      noResultsMessage.style.display = "block";

      const searchTerm = companySearchInput?.value.toLowerCase().trim() || "";
      const selectedLetter =
        alphabetFilter?.querySelector("li.active")?.textContent.trim() || "All";

      // Extract filters more reliably
      const industryButton = document.querySelector(".industry-filter");
      const industryFilter =
        industryButton?.getAttribute("data-value") ||
        (industryButton?.textContent.trim() !== "Industry"
          ? industryButton?.textContent.trim()
          : null);

      const locationButton = document.querySelector(".location-filter");
      const locationFilter =
        locationButton?.getAttribute("data-value") ||
        (locationButton?.textContent.trim() !== "Location"
          ? locationButton?.textContent.trim()
          : null);

      const ratingButton = document.querySelector(".rating-filter");
      const ratingFilter =
        ratingButton?.getAttribute("data-value") ||
        (ratingButton?.textContent.trim() !== "Rating"
          ? ratingButton?.textContent.trim()
          : null);

      // If search term is empty and "All" is selected, and no other filters are active
      if (
        !searchTerm &&
        selectedLetter === "All" &&
        !industryFilter &&
        !locationFilter &&
        !ratingFilter
      ) {
        await loadAdditionalCompanies();
        return;
      }

      // Fetch filtered companies
      const response = await fetchCompaniesByFilter({
        searchTerm,
        letter: selectedLetter !== "All" ? selectedLetter : null,
        industry: industryFilter,
        location: locationFilter,
        rating: ratingFilter,
      });

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const filteredCompanies = response.data;

      companiesGrid.innerHTML = "";
      existingCompanies = [];

      if (!filteredCompanies || filteredCompanies.length === 0) {
        // Build a detailed no results message
        let messageParts = [];
        if (searchTerm) messageParts.push(`matching "${searchTerm}"`);
        if (selectedLetter !== "All")
          messageParts.push(`starting with "${selectedLetter}"`);
        if (industryFilter) messageParts.push(`in ${industryFilter} industry`);
        if (locationFilter) messageParts.push(`located in ${locationFilter}`);
        if (ratingFilter) messageParts.push(`with rating ${ratingFilter}`);

        const message =
          messageParts.length > 0
            ? `No companies found ${messageParts.join(" and ")}`
            : "No companies match your search criteria.";

        noResultsMessage.textContent = message;
        noResultsMessage.style.display = "block";
        return;
      }

      // Display filtered companies
      filteredCompanies.forEach((company) => {
        const newCard = createCompanyCard({
          id: company.id,
          name: company.name,
          logo: company.logoUrl,
          rating: company.rating,
          industry: company.category,
          location: company.location,
          description: company.about,
          openInternships: company.currentNumberOfInternships,
        });

        companiesGrid.appendChild(newCard);
        existingCompanies.push({
          element: newCard,
          name: company.name,
          firstLetter: company.name.charAt(0).toUpperCase(),
        });
      });

      noResultsMessage.style.display = "none";
    } catch (error) {
      console.error("Error filtering companies:", error);
      noResultsMessage.textContent = error.message.includes("404")
        ? "No companies match your search criteria."
        : "There was an issue searching for companies. Please try again.";
      noResultsMessage.style.display = "block";

      // Restore previous companies if available
      if (existingCompanies.length > 0) {
        companiesGrid.innerHTML = "";
        existingCompanies.forEach((company) => {
          companiesGrid.appendChild(company.element);
        });
      }
    }
  }
  function createCompanyCard(company) {
    const card = document.createElement("div");
    card.className =
      "company-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover";
    card.setAttribute("data-name", company.name);

    // Generate star rating HTML
    const fullStars = Math.floor(company.rating);
    const hasHalfStar = company.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = "";
    for (let i = 0; i < fullStars; i++)
      starsHtml += '<i class="fas fa-star"></i>';
    if (hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++)
      starsHtml += '<i class="far fa-star"></i>';

    // Determine badge color based on industry
    let industryBadgeClass = "bg-blue-100 text-blue-800"; // Default
    if (company.industry === "Finance")
      industryBadgeClass = "bg-purple-100 text-purple-800";
    else if (company.industry === "Automotive")
      industryBadgeClass = "bg-red-100 text-red-800";
    else if (company.industry === "Retail")
      industryBadgeClass = "bg-pink-100 text-pink-800";
    else if (["Aerospace", "Consulting"].includes(company.industry))
      industryBadgeClass = "bg-indigo-100 text-indigo-800";

    card.innerHTML = `
      <div class="p-6">
        <div class="company-logo-container mb-4">
          <img class="company-logo h-full max-w-full object-contain" src="${
            company.logo || "https://via.placeholder.com/150"
          }" alt="${company.name} logo">
        </div>
        <div class="text-center">
          <h3 class="company-name text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300">${
            company.name
          }</h3>
          <div class="flex justify-center items-center mb-3">
            <div class="company-rating flex text-yellow-400">
              ${starsHtml}
            </div>
            <span class="rating-value text-sm text-gray-500 ml-1">${
              company.rating || "N/A"
            }</span>
          </div>
          <div class="flex flex-wrap justify-center gap-2 mb-4">
            <span class="company-industry inline-flex items-center rounded-full ${industryBadgeClass} px-3 py-1 text-xs font-medium">${
      company.industry || "N/A"
    }</span>
            <span class="company-location inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">${
              company.location || "N/A"
            }</span>
          </div>
          <p class="company-description text-sm text-gray-600 mb-4 line-clamp-3">
            ${company.description || "No description available."}
          </p>
          <div class="flex justify-between items-center">
            <span class="internship-count text-sm text-gray-500">${
              company.openInternships || 0
            } open internships</span>
            <a href="company-detail.html?id=${
              company.id || ""
            }" class="view-details text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details <i class="fas fa-arrow-right ml-1"></i></a>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  // Utility function
  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
});
