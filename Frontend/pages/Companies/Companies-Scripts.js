// This Handles UI rendering and interactions
import { fetchAdditionalCompanies, submitNewsletterSubscription, isValidEmail } from '../../apiRoutes/Api-Services/Companies-Service.js';

// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // ===== DOM ELEMENTS =====
  // Get all necessary DOM elements
  const companySearchInput = document.getElementById('companySearch');
  const alphabetFilter = document.getElementById('alphabetFilter');
  const companiesGrid = document.getElementById('companiesGrid');
  const noResultsMessage = document.getElementById('noResults');
  const loadMoreButton = document.querySelector('.load-more-btn');
  const resetFiltersButton = document.querySelector('.reset-filters');
  const userMenuButton = document.getElementById('user-menu-button');
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const newsletterForm = document.querySelector('.newsletter-form');
  
  // Get all filter dropdowns
  const filterDropdowns = document.querySelectorAll('.filter-dropdown');
  
  // Get all existing companies from the DOM
  const existingCompanies = Array.from(companiesGrid.querySelectorAll('.company-card')).map(card => {
    return {
      element: card,
      name: card.getAttribute('data-name'),
      firstLetter: card.getAttribute('data-name').charAt(0).toUpperCase()
    };
  });

  // Store additional companies data
  let additionalCompanies = [];
  
  // Fetch additional companies data on page load
  loadAdditionalCompanies();

  // Hide the "No results" message initially
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }

  // ===== SEARCH FUNCTIONALITY =====
  if (companySearchInput) {
    companySearchInput.addEventListener('input', function() {
      filterCompanies();
    });
    
    // Also handle the search button click
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        filterCompanies();
      });
    }
  }

  // ===== ALPHABET FILTER =====
  if (alphabetFilter) {
    const letters = alphabetFilter.querySelectorAll('li');
    letters.forEach(letter => {
      letter.addEventListener('click', function() {
        // Remove active class from all letters
        letters.forEach(l => {
          l.classList.remove('active', 'bg-indigo-600', 'text-white');
          l.classList.add('bg-gray-200');
        });
        
        // Add active class to clicked letter
        this.classList.add('active', 'bg-indigo-600', 'text-white');
        this.classList.remove('bg-gray-200');
        
        filterCompanies();
      });
    });
  }

  // ===== DROPDOWN FILTERS =====
  // Show/hide dropdowns when clicking the buttons
  if (filterDropdowns) {
    filterDropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Find the dropdown content associated with this button
        const dropdownContent = this.nextElementSibling;
        if (!dropdownContent) return;
        
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown-content').forEach(content => {
          if (content !== dropdownContent) {
            content.style.display = 'none';
          }
        });
        
        // Toggle this dropdown
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
      });
    });
  }
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.style.display = 'none';
    });
  });

  // Prevent dropdown from closing when clicking inside it
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // Handle filter selection
  document.querySelectorAll('.dropdown-content a').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the dropdown parent
      const dropdown = this.closest('.dropdown');
      if (!dropdown) return;
      
      // Get the filter button
      const filterButton = dropdown.querySelector('.filter-dropdown');
      if (!filterButton) return;
      
      // Get the filter type and value
      const filterType = filterButton.classList.contains('industry-filter') ? 'industry' : 
                         filterButton.classList.contains('location-filter') ? 'location' : 'rating';
      const filterValue = this.textContent.trim();
      
      // Update the button text to show the selected filter
      const icon = filterType === 'industry' ? 'fa-industry' : 
                   filterType === 'location' ? 'fa-map-marker-alt' : 'fa-star';
      filterButton.innerHTML = `<i class="fas ${icon}"></i> ${filterValue} <i class="fas fa-chevron-down text-xs"></i>`;
      
      // Close the dropdown
      this.closest('.dropdown-content').style.display = 'none';
      
      // Apply filters
      filterCompanies();
    });
  });

  // Reset filters
  if (resetFiltersButton) {
    resetFiltersButton.addEventListener('click', function() {
      // Reset industry filter
      const industryButton = document.querySelector('.industry-filter');
      if (industryButton) {
        industryButton.innerHTML = '<i class="fas fa-industry"></i> Industry <i class="fas fa-chevron-down text-xs"></i>';
      }
      
      // Reset location filter
      const locationButton = document.querySelector('.location-filter');
      if (locationButton) {
        locationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location <i class="fas fa-chevron-down text-xs"></i>';
      }
      
      // Reset rating filter
      const ratingButton = document.querySelector('.rating-filter');
      if (ratingButton) {
        ratingButton.innerHTML = '<i class="fas fa-star"></i> Rating <i class="fas fa-chevron-down text-xs"></i>';
      }
      
      // Reset alphabet filter
      if (alphabetFilter) {
        const letters = alphabetFilter.querySelectorAll('li');
        letters.forEach(l => {
          l.classList.remove('active', 'bg-indigo-600', 'text-white');
          l.classList.add('bg-gray-200');
        });
        
        // Set "All" as active
        const allButton = alphabetFilter.querySelector('li:first-child');
        if (allButton) {
          allButton.classList.add('active', 'bg-indigo-600', 'text-white');
          allButton.classList.remove('bg-gray-200');
        }
      }
      
      // Clear search input
      if (companySearchInput) {
        companySearchInput.value = '';
      }
      
      // Show all companies
      filterCompanies();
    });
  }

  // ===== LOAD MORE FUNCTIONALITY =====
  let currentlyDisplayed = 8; // Initial number of companies displayed
  const companiesPerLoad = 4; // Number of companies to add when "Load More" is clicked
  
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading...';
      this.disabled = true;
      
      // Create and add new company cards
      const companiesToAdd = additionalCompanies.slice(0, companiesPerLoad);
      additionalCompanies = additionalCompanies.slice(companiesPerLoad);
      
      companiesToAdd.forEach(company => {
        const newCard = createCompanyCard(company);
        companiesGrid.appendChild(newCard);
        existingCompanies.push({
          element: newCard,
          name: company.name,
          firstLetter: company.name.charAt(0).toUpperCase()
        });
      });
      
      currentlyDisplayed += companiesToAdd.length;
      
      // Reset button state
      this.innerHTML = 'Load More Companies';
      this.disabled = false;
      
      // Hide the button if no more companies to load
      if (additionalCompanies.length === 0) {
        this.style.display = 'none';
      }
      
      // Apply current filters to new cards
      filterCompanies();
    });
  }

  // ===== USER MENU FUNCTIONALITY =====
  if (userMenuButton) {
    // Check if user menu already exists
    let userMenu = document.querySelector('.user-menu-dropdown');
    
    // Create user menu dropdown if it doesn't exist
    if (!userMenu) {
      userMenu = document.createElement('div');
      userMenu.className = 'user-menu-dropdown origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10';
      userMenu.style.display = 'none';
      userMenu.innerHTML = `
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
      `;
      userMenuButton.parentNode.appendChild(userMenu);
    }
    
    userMenuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close user menu when clicking outside
    document.addEventListener('click', function() {
      if (userMenu) {
        userMenu.style.display = 'none';
      }
    });
  }

  // ===== MOBILE MENU FUNCTIONALITY =====
  if (mobileMenuButton) {
    // Check if mobile menu already exists
    let mobileMenu = document.querySelector('.mobile-menu');
    
    // Create mobile menu if it doesn't exist
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu sm:hidden';
      mobileMenu.style.display = 'none';
      mobileMenu.innerHTML = `
        <div class="pt-2 pb-3 space-y-1">
          <a href="index.html" class="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</a>
          <a href="#" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Browse Internships</a>
          <a href="companies.html" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Companies</a>
          <a href="#" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Resources</a>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">Tom Cook</div>
              <div class="text-sm font-medium text-gray-500">tom@example.com</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Your Profile</a>
            <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Settings</a>
            <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Sign out</a>
          </div>
        </div>
      `;
      
      // Insert after the navigation
      const nav = document.querySelector('nav');
      if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
      }
    }
    
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  // ===== NEWSLETTER SUBSCRIPTION =====
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (!emailInput) return;
      
      const email = emailInput.value.trim();
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Subscribing...';
      submitButton.disabled = true;
      
      // Call the API service
      submitNewsletterSubscription(email)
        .then(response => {
          // Remove any existing messages
          const existingMessages = this.querySelectorAll('.form-message');
          existingMessages.forEach(msg => msg.remove());
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'form-message text-green-500 mt-2';
          successMessage.textContent = response.message;
          this.appendChild(successMessage);
          
          // Clear the input
          emailInput.value = '';
          
          // Remove success message after 3 seconds
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        })
        .catch(error => {
          // Remove any existing messages
          const existingMessages = this.querySelectorAll('.form-message');
          existingMessages.forEach(msg => msg.remove());
          
          // Show error message
          const errorMessage = document.createElement('div');
          errorMessage.className = 'form-message text-red-500 mt-2';
          errorMessage.textContent = error.message || 'Please enter a valid email address.';
          this.appendChild(errorMessage);
          
          // Remove error message after 3 seconds
          setTimeout(() => {
            errorMessage.remove();
          }, 3000);
        })
        .finally(() => {
          // Reset button state
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }

  // ===== HELPER FUNCTIONS =====
  
  // Load additional companies from API
  async function loadAdditionalCompanies() {
    try {
      additionalCompanies = await fetchAdditionalCompanies();
      console.log('Additional companies loaded:', additionalCompanies.length);
      
      // Enable the load more button if we have companies
      if (loadMoreButton && additionalCompanies.length > 0) {
        loadMoreButton.disabled = false;
      }
    } catch (error) {
      console.error('Error loading additional companies:', error);
      
      // Disable the load more button if there was an error
      if (loadMoreButton) {
        loadMoreButton.disabled = true;
        loadMoreButton.innerHTML = 'Failed to load more companies';
      }
    }
  }
  
  // Filter companies based on search, alphabet, and dropdown filters
  function filterCompanies() {
    if (!companiesGrid || !existingCompanies) return;
    
    const searchTerm = companySearchInput ? companySearchInput.value.toLowerCase().trim() : '';
    const selectedLetter = alphabetFilter ? alphabetFilter.querySelector('li.active')?.textContent.trim() : 'All';
    
    // Get selected filters from dropdowns
    let industryFilter = null;
    const industryButton = document.querySelector('.industry-filter');
    if (industryButton) {
      const industryText = industryButton.textContent.trim();
      industryFilter = industryText === 'Industry' ? null : industryText.split(' ')[0];
    }
    
    let locationFilter = null;
    const locationButton = document.querySelector('.location-filter');
    if (locationButton) {
      const locationText = locationButton.textContent.trim();
      locationFilter = locationText === 'Location' ? null : locationText.split(' ')[0];
    }
    
    let ratingFilter = null;
    const ratingButton = document.querySelector('.rating-filter');
    if (ratingButton) {
      const ratingText = ratingButton.textContent.trim();
      ratingFilter = ratingText === 'Rating' ? null : ratingText;
    }
    
    let visibleCount = 0;
    
    existingCompanies.forEach(company => {
      const card = company.element;
      const companyName = company.name.toLowerCase();
      const firstLetter = company.firstLetter;
      
      // Get company details for filtering
      const industryElement = card.querySelector('.company-industry');
      const industry = industryElement ? industryElement.textContent.trim() : '';
      
      const locationElement = card.querySelector('.company-location');
      const location = locationElement ? locationElement.textContent.trim() : '';
      
      const ratingElement = card.querySelector('.rating-value');
      const rating = ratingElement ? parseFloat(ratingElement.textContent.trim()) : 0;
      
      // Apply filters
      let visible = true;
      
      // Search filter
      if (searchTerm && !companyName.includes(searchTerm)) {
        visible = false;
      }
      
      // Alphabet filter
      if (selectedLetter && selectedLetter !== 'All' && firstLetter !== selectedLetter) {
        visible = false;
      }
      
      // Industry filter
      if (industryFilter && !industry.includes(industryFilter)) {
        visible = false;
      }
      
      // Location filter
      if (locationFilter && !location.includes(locationFilter)) {
        visible = false;
      }
      
      // Rating filter
      if (ratingFilter) {
        const minRating = ratingFilter.includes('4+') ? 4 : ratingFilter.includes('3+') ? 3 : 0;
        if (rating < minRating) {
          visible = false;
        }
      }
      
      // Show/hide the card
      card.style.display = visible ? 'block' : 'none';
      
      if (visible) {
        visibleCount++;
      }
    });
    
    // Show/hide "No results" message
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
      
      // Center the "No results" message
      if (visibleCount === 0) {
        noResultsMessage.style.textAlign = 'center';
        noResultsMessage.style.width = '100%';
        noResultsMessage.style.padding = '2rem';
        noResultsMessage.style.fontSize = '1.125rem';
        noResultsMessage.style.color = '#6b7280';
      }
    }
  }
  
  // Create a new company card
  function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover';
    card.setAttribute('data-name', company.name);
    
    // Generate star rating HTML
    let starsHtml = '';
    const fullStars = Math.floor(company.rating);
    const hasHalfStar = company.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }
    
    // Determine badge color based on industry
    let industryBadgeClass = 'bg-blue-100 text-blue-800'; // Default for Technology
    
    if (company.industry === 'Finance') {
      industryBadgeClass = 'bg-purple-100 text-purple-800';
    } else if (company.industry === 'Automotive') {
      industryBadgeClass = 'bg-red-100 text-red-800';
    } else if (company.industry === 'Retail') {
      industryBadgeClass = 'bg-pink-100 text-pink-800';
    } else if (company.industry === 'Aerospace' || company.industry === 'Consulting') {
      industryBadgeClass = 'bg-indigo-100 text-indigo-800';
    }
    
    card.innerHTML = `
      <div class="p-6">
        <div class="company-logo-container mb-4">
          <img class="company-logo h-full max-w-full object-contain" src="${company.logo}" alt="${company.name} logo">
        </div>
        <div class="text-center">
          <h3 class="company-name text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300">${company.name}</h3>
          <div class="flex justify-center items-center mb-3">
            <div class="company-rating flex text-yellow-400">
              ${starsHtml}
            </div>
            <span class="rating-value text-sm text-gray-500 ml-1">${company.rating}</span>
          </div>
          <div class="flex flex-wrap justify-center gap-2 mb-4">
            <span class="company-industry inline-flex items-center rounded-full ${industryBadgeClass} px-3 py-1 text-xs font-medium">${company.industry}</span>
            <span class="company-location inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">${company.location}</span>
          </div>
          <p class="company-description text-sm text-gray-600 mb-4 line-clamp-3">
            ${company.description}
          </p>
          <div class="flex justify-between items-center">
            <span class="internship-count text-sm text-gray-500">${company.openInternships} open internships</span>
            <a href="company-detail.html" class="view-details text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details <i class="fas fa-arrow-right ml-1"></i></a>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  // Initialize the page
  function init() {
    // Hide all dropdown contents initially
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.style.display = 'none';
    });
    
    // Set up company logo containers
    document.querySelectorAll('.company-logo-container').forEach(container => {
      container.style.height = '80px';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
    });
    
    console.log('InternHub JavaScript initialized successfully!');
  }
  
  // Run initialization
  init();
});