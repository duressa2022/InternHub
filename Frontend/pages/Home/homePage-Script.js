import HomeService from "../../apiRoutes/Api-Services/HomeService.js";

// Initialize the page
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Fetch and display internships
    await loadInternships();

    // Initialize search functionality
    initializeSearch();

    // Initialize filters
    initializeFilters();

    // Initialize chatbot
    initializeChatbot();
  } catch (error) {
    console.error("Error initializing page:", error);
    showError("Failed to load internships. Please try again later.");
  }
});

// Load internships from the backend
async function loadInternships(filters = {}) {
  try {
    const response = await HomeService.getInternships();
    // The response has the data in response.data
    const internships = response.data;
    if (!Array.isArray(internships)) {
      console.error("Invalid response format:", response);
      showError("Invalid data format received from server");
      return;
    }
    displayInternships(internships);
  } catch (error) {
    console.error("Error loading internships:", error);
    showError("Failed to load internships. Please try again later.");
  }
}

// Display internships in the DOM
function displayInternships(internships) {
  const internshipsContainer = document.getElementById("internships-container");
  if (!internshipsContainer) return;

  // Set the original grid layout classes
  internshipsContainer.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  internshipsContainer.innerHTML = ""; // Clear existing content

  if (!Array.isArray(internships) || internships.length === 0) {
    // Show no results state
    const noResultsState = document.getElementById("no-results-state");
    if (noResultsState) {
      noResultsState.classList.remove("hidden");
    }
    return;
  }

  // Hide no results state if it exists
  const noResultsState = document.getElementById("no-results-state");
  if (noResultsState) {
    noResultsState.classList.add("hidden");
  }

  internships.forEach((internship) => {
    const internshipCard = createInternshipCard(internship);
    internshipsContainer.appendChild(internshipCard);
  });
}

// Create an internship card element
function createInternshipCard(internship) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 card-hover search-card";
  card.innerHTML = `
        <div class="p-6">
            <div class="flex items-start justify-between">
                <div class="flex items-center">
                    <img
                        class="h-12 w-12 rounded-full object-cover"
                        src="https://logo.clearbit.com/${internship.company
                          .toLowerCase()
                          .replace(/\s+/g, "")}.com"
                        alt="${internship.company} logo"
                    />
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-900 text-search">
                            ${internship.title}
                        </h3>
                        <p class="text-sm text-gray-500">${
                          internship.company
                        }</p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-gray-500">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 tag-hover cursor-pointer">
                    ${internship.type}
                </span>
                <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 tag-hover cursor-pointer">
                    ${internship.salaryRange}
                </span>
                <span class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 tag-hover cursor-pointer">
                    ${internship.category}
                </span>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-600 line-clamp-3">
                    ${internship.description}
                </p>
            </div>
            <div class="mt-4 flex items-center text-sm text-gray-500">
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span>${internship.location}</span>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                    <i class="far fa-clock mr-2"></i>
                    <span>Posted ${formatDate(internship.created_at)}</span>
                </div>
                <a href="${
                  internship.link
                }" target="_blank" class="apply-btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                    Apply Now
                </a>
            </div>
        </div>
    `;
  return card;
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

// Get status class for styling
function getStatusClass(type) {
  const statusClasses = {
    "Full-time": "bg-green-100 text-green-800",
    "Part-time": "bg-blue-100 text-blue-800",
    Remote: "bg-purple-100 text-purple-800",
    Hybrid: "bg-yellow-100 text-yellow-800",
  };
  return statusClasses[type] || "bg-gray-100 text-gray-800";
}

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("searchbutton");

  if (searchInput && searchButton) {
    // Real-time search
    searchInput.addEventListener(
      "input",
      debounce(async (e) => {
        const query = e.target.value.trim();
        if (query) {
          try {
            const results = await HomeService.searchInternships(query);
            displayInternships(results);
          } catch (error) {
            console.error("Error searching internships:", error);
          }
        } else {
          await loadInternships();
        }
      }, 300)
    );

    // Search button click
    searchButton.addEventListener("click", async () => {
      const query = searchInput.value.trim();
      if (query) {
        try {
          const results = await HomeService.searchInternships(query);
          displayInternships(results);
        } catch (error) {
          console.error("Error searching internships:", error);
        }
      }
    });
  }
}

// Initialize filters
function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-dropdown");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dropdown = button.nextElementSibling;
      dropdown.classList.toggle("hidden");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
        dropdown.classList.add("hidden");
      });
    }
  });
}

// Initialize chatbot
function initializeChatbot() {
  const chatbotButton = document.getElementById("chatbotButton");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const closeChatbot = document.getElementById("closeChatbot");

  if (chatbotButton && chatbotWindow && closeChatbot) {
    chatbotButton.addEventListener("click", () => {
      chatbotWindow.classList.toggle("active");
    });

    closeChatbot.addEventListener("click", () => {
      chatbotWindow.classList.remove("active");
    });
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative";
  errorDiv.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${message}</span>
    `;

  const container = document.querySelector(".max-w-7xl");
  if (container) {
    container.insertBefore(errorDiv, container.firstChild);

    // Remove error message after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Chatbot functionality
document.addEventListener("DOMContentLoaded", function () {
  const chatbotButton = document.getElementById("chatbotButton");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const closeChatbot = document.getElementById("closeChatbot");

  // Toggle chatbot window
  chatbotButton.addEventListener("click", function () {
    chatbotWindow.classList.toggle("active");
  });

  // Close chatbot window
  closeChatbot.addEventListener("click", function () {
    chatbotWindow.classList.remove("active");
  });
});

// Handle chat input
function handleChatInput(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

// Send message function
function sendMessage() {
  const input = document.getElementById("chatbotInput");
  const message = input.value.trim();

  if (message) {
    // Add user message
    addMessage(message, "user");
    input.value = "";

    // Show typing indicator
    showTypingIndicator();

    // Simulate bot response after a delay
    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateBotResponse(message);
      addMessage(botResponse.text, "bot", botResponse.quickReplies);
    }, 1000 + Math.random() * 2000);
  }
}

// Quick reply function
function sendQuickReply(element) {
  const message = element.textContent;
  const messagesContainer = document.getElementById("chatbotMessages");

  // Add user message
  addMessage(message, "user");

  // Show typing indicator
  showTypingIndicator();

  // Simulate bot response after a delay
  setTimeout(() => {
    removeTypingIndicator();
    const botResponse = generateBotResponse(message);
    addMessage(botResponse.text, "bot", botResponse.quickReplies);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000 + Math.random() * 2000);
}

// Add message to chat
function addMessage(text, sender, quickReplies = null) {
  const messagesContainer = document.getElementById("chatbotMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  const messageText = document.createElement("p");
  messageText.textContent = text;
  messageDiv.appendChild(messageText);

  if (quickReplies) {
    const quickRepliesDiv = document.createElement("div");
    quickRepliesDiv.className = "quick-replies mt-2";

    quickReplies.forEach((reply) => {
      const replyDiv = document.createElement("div");
      replyDiv.className = "quick-reply";
      replyDiv.textContent = reply;
      replyDiv.onclick = function () {
        sendQuickReply(this);
      };
      quickRepliesDiv.appendChild(replyDiv);
    });

    messageDiv.appendChild(quickRepliesDiv);
  }

  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  const messagesContainer = document.getElementById("chatbotMessages");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.id = "typingIndicator";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    typingDiv.appendChild(dot);
  }

  messagesContainer.appendChild(typingDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Generate bot response based on user input
function generateBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  let response = {};

  if (
    lowerMessage.includes("internship") ||
    lowerMessage.includes("find") ||
    lowerMessage.includes("search")
  ) {
    response.text =
      "I can help you find great internships! What field are you interested in? You can browse by category or use the search bar at the top of the page.";
    response.quickReplies = [
      "Software Engineering",
      "Marketing",
      "Finance",
      "Data Science",
    ];
  } else if (
    lowerMessage.includes("application") ||
    lowerMessage.includes("apply") ||
    lowerMessage.includes("tip")
  ) {
    response.text =
      "Here are some application tips:\n1. Tailor your resume for each position\n2. Write a compelling cover letter\n3. Highlight relevant projects and coursework\n4. Follow up after applying\nWould you like more details on any of these?";
    response.quickReplies = [
      "Resume tips",
      "Cover letter help",
      "Interview prep",
      "Follow-up advice",
    ];
  } else if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
    response.text =
      "For your resume:\n- Keep it to one page\n- Use action verbs\n- Quantify achievements\n- Include relevant coursework\nWe have a resume builder tool you can use. Would you like me to direct you there?";
    response.quickReplies = [
      "Yes, show resume builder",
      "No thanks",
      "Cover letter tips",
      "Examples",
    ];
  } else if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    response.text =
      "Hello! 😊 How can I assist you with your internship search today?";
    response.quickReplies = [
      "Find internships",
      "Application tips",
      "Resume help",
      "Interview prep",
    ];
  } else {
    response.text =
      "I'm here to help with your internship search! You can ask me about finding internships, application tips, resume advice, or interview preparation. What would you like to know?";
    response.quickReplies = [
      "Find internships",
      "Application tips",
      "Resume help",
      "Interview prep",
    ];
  }

  return response;
}

// Simple script to handle mobile menu toggle (can be expanded)
const mobileMenuButton = document.querySelector(".sm\\:hidden button");
const mobileMenu = document.querySelector(".sm\\:hidden + div");

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", function () {
    // This would toggle a mobile menu if implemented
    console.log("Mobile menu clicked");
  });
}

// Newsletter form submission
const newsletterForm = document.querySelector("form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
    e.target.reset();
  });
}

// serch engine
document.getElementById("search").addEventListener("input", () => {
  const searchInput = document.getElementById("search");
  const searchCard = document.getElementsByClassName("search-card");
  const query = searchInput.value.trim().toLowerCase();

  const textForSearch = document.getElementsByClassName("text-search");

  for (let i = 0; i < textForSearch.length; i++) {
    const text = textForSearch[i].textContent.toLowerCase();

    if (!query || text.includes(query)) {
      searchCard[i].style.display = "";
    } else {
      searchCard[i].style.display = "none";
    }
  }
});
