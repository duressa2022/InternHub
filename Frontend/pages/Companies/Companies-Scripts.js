import { fetchCompanies } from './browse-fetch-data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const companiesGrid = document.getElementById('companiesGrid');
  const filterList = document.getElementById("alphabetFilter"); // A-Z list
  const searchInput = document.getElementById("companySearch"); // Search input
  const resetButton = document.querySelector(".fa-sync-alt").parentElement; // Reset Filters button
  
  let selectedLetter = "All";
  let searchTerm = "";

  // Fetch companies and render the grid
  const companies = await fetchCompanies();

  companies.forEach(company => {
    const card = document.createElement('div');
    card.className = 'company-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover';
    card.setAttribute('data-name', company.name);

    card.innerHTML = `
      <div class="p-6">
        <div class="company-logo-container mb-4">
          <img class="h-full max-w-full object-contain" src="${company.logo}" alt="${company.name} logo">
        </div>
        <div class="text-center">
          <h3 class="company-name text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300">${company.name}</h3>
          <div class="flex justify-center items-center mb-3">
            <div class="flex text-yellow-400">
              ${generateStars(company.rating)}
            </div>
            <span class="text-sm text-gray-500 ml-1">${company.rating}</span>
          </div>
          <div class="flex flex-wrap justify-center gap-2 mb-4">
            <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">${company.industry}</span>
            <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">${company.location}</span>
          </div>
          <p class="text-sm text-gray-600 mb-4 line-clamp-3">
            ${company.description}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">${company.internships} open internships</span>
            <a href="${company.link}" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details <i class="fas fa-arrow-right ml-1"></i></a>
          </div>
        </div>
      </div>
    `;
    companiesGrid.appendChild(card);
  });

  // Apply filters and search
  function applyFilters() {
    const cards = document.querySelectorAll(".company-card");
    let anyVisible = false;

    cards.forEach(card => {
      const companyName = (card.dataset.name || "").toUpperCase();
      const matchesLetter = selectedLetter === "All" || companyName.startsWith(selectedLetter);
      const matchesSearch = companyName.includes(searchTerm.toUpperCase());
      const isVisible = matchesLetter && matchesSearch;

      card.style.display = isVisible ? "" : "none";

      if (isVisible) anyVisible = true;
    });

    const noResults = document.getElementById("noResults");
    if (noResults) {
      noResults.style.display = anyVisible ? "none" : "block";
    }
  }

  // Helper function to generate stars
  function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }
    return starsHtml;
  }

  // A-Z Filter
  if (filterList) {
    filterList.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() !== 'li') return;
      Array.from(filterList.children).forEach(li => {
        li.classList.remove("bg-indigo-600", "text-white", "active");
        li.classList.add("bg-gray-200");
      });
      e.target.classList.add("bg-indigo-600", "text-white", "active");
      e.target.classList.remove("bg-gray-200");

      selectedLetter = e.target.textContent.trim() === "All" 
          ? "All" 
          : e.target.textContent.trim().toUpperCase();

      applyFilters();
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchTerm = searchInput.value.trim();
      applyFilters();
    });
  }

  // Reset button
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      selectedLetter = "All";
      searchTerm = "";

      if (searchInput) searchInput.value = "";

      // Reset active button styles
      if (filterList) {
        Array.from(filterList.children).forEach(li => {
          li.classList.remove("bg-indigo-600", "text-white", "active");
          li.classList.add("bg-gray-200");
        });
        const allButton = Array.from(filterList.children).find(li => li.textContent.trim() === "All");
        if (allButton) {
          allButton.classList.add("bg-indigo-600", "text-white", "active");
          allButton.classList.remove("bg-gray-200");
        }
      }

      applyFilters();
    });
  }

  applyFilters(); // Initial load

  // Newsletter form submission
  const newsletterForm = document.querySelector('footer form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
      e.target.reset();
    });
  }
});
