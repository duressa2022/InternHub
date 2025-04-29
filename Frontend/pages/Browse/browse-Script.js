// browse-Script.js - Handles UI rendering and interactions
import { 
    fetchInternships, 
    fetchFilteredInternships, 
    fetchPaginatedInternships,
    submitNewsletterSubscription,
    toggleBookmark,
    applyForInternship,
    isValidEmail
  } from '../../apiRoutes/Api-Services/Browse-Service.js';
  
  // Wait for the DOM to be fully loaded before executing JavaScript
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredInternships = [];
    
    // DOM elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const internshipCardsContainer = document.getElementById('internship-cards');
    const appliedFiltersContainer = document.getElementById('applied-filters');
    const resetFiltersButton = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-select');
    const salaryRange = document.getElementById('salary-range');
    const salaryDisplay = document.getElementById('salary-display');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const resultsCountStart = document.getElementById('results-count-start');
    const resultsCountEnd = document.getElementById('results-count-end');
    const resultsCountTotal = document.getElementById('results-count-total');
    const noResultsMessage = document.getElementById('no-results');
    
    // Filter elements
    const filterToggles = document.querySelectorAll('.filter-toggle');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const jobTypeCheckboxes = document.querySelectorAll('.job-type-checkbox');
    const locationCheckboxes = document.querySelectorAll('.location-checkbox');
    const industryCheckboxes = document.querySelectorAll('.industry-checkbox');
    const experienceCheckboxes = document.querySelectorAll('.experience-checkbox');
    
    // Initialize the page
    initializeFilters();
    loadInternships();
    
    // Event listeners
    searchButton.addEventListener('click', handleSearch);
    
    // Make search work without hitting the search button
    searchInput.addEventListener('input', function() {
        // Add debounce to avoid too many requests
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            handleSearch();
        }, 500);
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    resetFiltersButton.addEventListener('click', resetFilters);
    sortSelect.addEventListener('change', handleSort);
    salaryRange.addEventListener('input', handleSalaryChange);
    
    prevPageButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadInternships();
        }
    });
    
    nextPageButton.addEventListener('click', function(e) {
        e.preventDefault();
        const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadInternships();
        }
    });
    
    // Toggle filter sections
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const section = this.nextElementSibling;
            section.classList.toggle('expanded');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
    
    // Expand all filter sections by default
    document.querySelectorAll('.filter-section').forEach(section => {
        section.classList.add('expanded');
    });
    
    // Add event listeners to all filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
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

    async function loadInternships() {
        // Show loading state (without fade animation)
        disableInteractions();
        
        try {
            // Get filter values
            const filters = getFilterValues();
            
            // Fetch paginated internships from API
            const result = await fetchPaginatedInternships(currentPage, itemsPerPage, filters);
            
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
            console.error('Error loading internships:', error);
            showErrorMessage('Failed to load internships. Please try again later.');
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
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset salary range
        salaryRange.value = 30;
        updateSalaryDisplay(30);
        
        // Reset search
        searchInput.value = '';
        
        // Reset sort
        sortSelect.value = 'relevant';
        
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
            sortBy
        };
    }
    
    function getSelectedValues(checkboxes) {
        const selectedValues = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedValues.push(checkbox.value);
            }
        });
        return selectedValues;
    }
    
    function updateAppliedFilters() {
        appliedFiltersContainer.innerHTML = '';
        
        // Get all selected filters
        const selectedJobTypes = getSelectedValues(jobTypeCheckboxes);
        const selectedLocations = getSelectedValues(locationCheckboxes);
        const selectedIndustries = getSelectedValues(industryCheckboxes);
        const selectedExperience = getSelectedValues(experienceCheckboxes);
        
        // Add job type filters
        selectedJobTypes.forEach(jobType => {
            addAppliedFilter(jobType, 'job-type');
        });
        
        // Add location filters
        selectedLocations.forEach(location => {
            addAppliedFilter(location, 'location');
        });
        
        // Add industry filters
        selectedIndustries.forEach(industry => {
            addAppliedFilter(industry, 'industry');
        });
        
        // Add experience filters
        selectedExperience.forEach(experience => {
            addAppliedFilter(experience, 'experience');
        });
        
        // Add search term if present
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            addAppliedFilter(`"${searchTerm}"`, 'search');
        }
        
        // Add clear all button if there are filters
        if (appliedFiltersContainer.children.length > 0) {
            const clearAllButton = document.createElement('button');
            clearAllButton.className = 'text-indigo-600 hover:text-indigo-800 text-sm font-medium ml-2';
            clearAllButton.textContent = 'Clear all';
            clearAllButton.addEventListener('click', resetFilters);
            appliedFiltersContainer.appendChild(clearAllButton);
        }
    }
    
    function addAppliedFilter(filterText, filterType) {
        const filterSpan = document.createElement('span');
        filterSpan.className = 'inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800';
        filterSpan.innerHTML = `
            ${filterText}
            <button class="ml-1 text-indigo-600 hover:text-indigo-900">
                <i class="fas fa-times text-xs"></i>
            </button>
        `;
        
        // Add click event to remove this filter
        const removeButton = filterSpan.querySelector('button');
        removeButton.addEventListener('click', () => {
            removeFilter(filterText, filterType);
        });
        
        appliedFiltersContainer.appendChild(filterSpan);
    }
    
    function removeFilter(filterText, filterType) {
        switch(filterType) {
            case 'job-type':
                jobTypeCheckboxes.forEach(checkbox => {
                    if (checkbox.value === filterText) checkbox.checked = false;
                });
                break;
            case 'location':
                locationCheckboxes.forEach(checkbox => {
                    if (checkbox.value === filterText) checkbox.checked = false;
                });
                break;
            case 'industry':
                industryCheckboxes.forEach(checkbox => {
                    if (checkbox.value === filterText) checkbox.checked = false;
                });
                break;
            case 'experience':
                experienceCheckboxes.forEach(checkbox => {
                    if (checkbox.value === filterText) checkbox.checked = false;
                });
                break;
            case 'search':
                searchInput.value = '';
                break;
        }
        
        applyFilters();
    }
    
    function renderInternships(internships) {
        internshipCardsContainer.innerHTML = '';
        
        if (internships.length === 0) {
            return;
        }
        
        internships.forEach(internship => {
            const card = createInternshipCard(internship);
            internshipCardsContainer.appendChild(card);
        });
        
        // Add event listeners to the newly created cards
        document.querySelectorAll('.apply-btn').forEach(button => {
            button.addEventListener('click', function() {
                const internshipId = this.getAttribute('data-id');
                handleApplyClick(internshipId);
            });
        });
        
        document.querySelectorAll('.bookmark-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const internshipId = this.getAttribute('data-id');
                const icon = this.querySelector('i');
                const isCurrentlyBookmarked = icon.classList.contains('fas');
                
                // Toggle bookmark state
                handleBookmarkToggle(internshipId, !isCurrentlyBookmarked);
                
                // Update UI immediately for better UX
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('text-indigo-600');
            });
        });
    }
    
    function createInternshipCard(internship) {
        const card = document.createElement('div');
        card.className = 'internship-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover';
        
        // Determine work mode class and text
        let workModeClass = 'bg-purple-100 text-purple-800';
        if (internship.workMode === 'On-site') {
            workModeClass = 'bg-yellow-100 text-yellow-800';
        } else if (internship.workMode === 'Hybrid') {
            workModeClass = 'bg-orange-100 text-orange-800';
        }
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div class="flex items-center">
                        <img class="h-12 w-12 rounded-full object-cover" src="${internship.logo}" alt="${internship.company} logo">
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">${internship.title}</h3>
                            <p class="text-sm text-gray-500">${internship.company}</p>
                        </div>
                    </div>
                    <button class="bookmark-btn text-gray-400 hover:text-indigo-600" data-id="${internship.id}">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 tag-hover cursor-pointer">${internship.jobType}</span>
                    <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 tag-hover cursor-pointer">${internship.isPaid ? 'Paid' : 'Unpaid'}</span>
                    <span class="inline-flex items-center rounded-full ${workModeClass} px-3 py-1 text-xs font-medium tag-hover cursor-pointer">${internship.workMode}</span>
                </div>
                <div class="mt-4">
                    <p class="text-sm text-gray-600 line-clamp-3">${internship.description}</p>
                </div>
                <div class="mt-4 flex items-center text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${internship.location}</span>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-500">
                        <i class="far fa-clock mr-2"></i>
                        <span>Posted ${internship.postedDays} ${internship.postedDays === 1 ? 'day' : 'days'} ago</span>
                    </div>
                    <button class="apply-btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300" data-id="${internship.id}">
                        Apply Now
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function updatePagination(pagination) {
        const { currentPage, totalPages } = pagination;
        paginationNumbers.innerHTML = '';
        
        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.className = `pagination-btn relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${i === currentPage ? 'active bg-indigo-600 text-white' : ''}`;
            pageLink.textContent = i;
            
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                loadInternships();
            });
            
            paginationNumbers.appendChild(pageLink);
        }
        
        // Add ellipsis if needed
        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700';
            ellipsis.textContent = '...';
            paginationNumbers.appendChild(ellipsis);
            
            // Add last page
            const lastPage = document.createElement('a');
            lastPage.href = '#';
            lastPage.className = 'pagination-btn relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50';
            lastPage.textContent = totalPages;
            
            lastPage.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = totalPages;
                loadInternships();
            });
            
            paginationNumbers.appendChild(lastPage);
        }
        
        // Update prev/next buttons
        prevPageButton.classList.toggle('opacity-50', currentPage === 1);
        nextPageButton.classList.toggle('opacity-50', currentPage === totalPages);
    }
    
    function updateResultsCount(pagination) {
        const { startIndex, endIndex, totalItems } = pagination;
        
        resultsCountStart.textContent = totalItems > 0 ? startIndex : 0;
        resultsCountEnd.textContent = endIndex;
        resultsCountTotal.textContent = totalItems;
    }
    
    // Replaced showLoadingState and hideLoadingState with these functions
    // that don't use opacity/fade animations
    function disableInteractions() {
        // Disable buttons during loading
        searchButton.disabled = true;
        resetFiltersButton.disabled = true;
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
    }
    
    function enableInteractions() {
        // Enable buttons
        searchButton.disabled = false;
        resetFiltersButton.disabled = false;
        prevPageButton.disabled = false;
        nextPageButton.disabled = false;
    }
    
    function showNoResultsMessage() {
        noResultsMessage.classList.remove('hidden');
        
        // Add event listener to the clear search button
        const clearSearchButton = document.getElementById('clear-search');
        if (clearSearchButton) {
            clearSearchButton.addEventListener('click', resetFilters);
        }
    }
    
    function hideNoResultsMessage() {
        noResultsMessage.classList.add('hidden');
    }
    
    function showErrorMessage(message) {
        // Create error message element if it doesn't exist
        let errorMessage = document.getElementById('error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.id = 'error-message';
            errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6';
            
            // Insert before internship cards
            internshipCardsContainer.parentNode.insertBefore(errorMessage, internshipCardsContainer);
        }
        
        errorMessage.innerHTML = `
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        `;
        
        // Add close button functionality
        const closeButton = errorMessage.querySelector('svg');
        closeButton.addEventListener('click', function() {
            errorMessage.remove();
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }
    
    async function handleApplyClick(internshipId) {
        try {
            // In a real app, you would collect application data from a form
            const applicationData = {
                userId: 'user123', // This would come from authentication
                resumeUrl: 'https://example.com/resume.pdf',
                coverLetter: 'I am excited to apply for this position...'
            };
            
            const result = await applyForInternship(internshipId, applicationData);
            
            // Show success message
            alert(result.message);
        } catch (error) {
            console.error('Error applying for internship:', error);
            alert('Failed to submit application. Please try again later.');
        }
    }
    
    async function handleBookmarkToggle(internshipId, isBookmarked) {
        try {
            await toggleBookmark(internshipId, isBookmarked);
            // Success is handled by updating the UI immediately for better UX
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            // Revert the UI change if the API call fails
            const bookmarkButton = document.querySelector(`.bookmark-btn[data-id="${internshipId}"]`);
            if (bookmarkButton) {
                const icon = bookmarkButton.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('text-indigo-600');
            }
        }
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput) return;
            
            const email = emailInput.value.trim();
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Subscribing...';
            submitButton.disabled = true;
            
            try {
                const response = await submitNewsletterSubscription(email);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'text-green-500 mt-2';
                successMessage.textContent = response.message;
                this.appendChild(successMessage);
                
                // Clear the input
                emailInput.value = '';
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'text-red-500 mt-2';
                errorMessage.textContent = error.message || 'Please enter a valid email address.';
                this.appendChild(errorMessage);
                
                // Remove error message after 3 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
  });