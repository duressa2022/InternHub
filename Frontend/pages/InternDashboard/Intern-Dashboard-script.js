import { dashboardAPI } from "../../apiRoutes/Api-Services/Intern-Dashboard-Service.js";

const dom = {
  loadingOverlay: document.getElementById("loadingOverlay"),
  errorToast: document.getElementById("errorToast"),
  welcomeName: document.querySelector("[data-welcome-name]"),
  welcomeStats: document.querySelector("[data-welcome-stats]"),
  statsContainer: document.getElementById("statsContainer"),
  applicationsBody: document.getElementById("applicationsBody"),
  statusBarsContainer: document.getElementById("statusBarsContainer"),
  sidebarToggle: document.getElementById("sidebarToggle"),
  sidebar: document.getElementById("sidebar"),
  mainContent: document.getElementById("mainContent"),
  pageTitle: document.getElementById("pageTitle"),
  navLinks: document.querySelectorAll(".nav-link"),
  sections: document.querySelectorAll(".section-content"),
  applicationForm: document.getElementById("applicationForm"),
  profileContent: document.getElementById("profileContent"),
};

// State
let currentUser = null;
let currentSection = "dashboard";
let currentProfile = null;

// Utility Functions
const showLoading = (show) => {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.classList.toggle("hidden", !show);
  }
};

const showError = (message) => {
  if (dom.errorToast) {
    dom.errorToast.textContent = message;
    dom.errorToast.classList.remove("hidden");
    setTimeout(() => dom.errorToast.classList.add("hidden"), 5000);
  }
  console.error(message);
};

// Mock data for profile
const mockProfileData = {
  id: 1,
  first_name: "Sarah",
  last_name: "Johnson",
  email: "sarah.johnson@stanford.edu",
  field: "Software Engineering",
  avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
  phone_number: "+1 (555) 123-4567",
  city: "Stanford",
  country: "United States",
  about:
    "Passionate software engineering student with a focus on web development and user experience. Currently pursuing a degree in Computer Science at Stanford University. Experienced in React, Node.js, and modern web technologies.",
  website: "https://sarahjohnson.dev",
  social_links: {
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
    twitter: "twitter.com/sarahjohnson",
  },
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "Git",
    "UI/UX Design",
    "Agile Methodologies",
    "RESTful APIs",
    "MongoDB",
  ],
  experience: [
    {
      id: 1,
      company: "Tech Corp",
      position: "Software Engineering Intern",
      duration: "Jun 2023 - Present",
      description:
        "Working on frontend development using React and TypeScript. Implementing new features and improving user experience.",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      company: "StartUp Inc",
      position: "Web Development Intern",
      duration: "Jan 2023 - May 2023",
      description:
        "Developed and maintained company website using HTML, CSS, and JavaScript. Implemented responsive design and improved performance.",
      location: "Palo Alto, CA",
    },
  ],
  education: [
    {
      id: 1,
      school: "Stanford University",
      degree: "Bachelor of Science in Computer Science",
      duration: "2021 - 2025",
      gpa: "3.8",
      location: "Stanford, CA",
    },
  ],
  applications: [
    {
      id: 1,
      company: "Google",
      position: "Software Engineering Intern",
      status: "interview",
      date: "2024-02-15",
      company_logo: "https://logo.clearbit.com/google.com",
    },
    {
      id: 2,
      company: "Microsoft",
      position: "Frontend Developer Intern",
      status: "pending",
      date: "2024-02-10",
      company_logo: "https://logo.clearbit.com/microsoft.com",
    },
    {
      id: 3,
      company: "Amazon",
      position: "Full Stack Intern",
      status: "reviewed",
      date: "2024-02-05",
      company_logo: "https://logo.clearbit.com/amazon.com",
    },
  ],
  stats: {
    total_applications: 15,
    interviews: 5,
    offers: 2,
    days_searching: 45,
  },
};

// Mock data for companies
const mockCompanies = [
  { id: 1, name: "Google", logo: "https://logo.clearbit.com/google.com" },
  { id: 2, name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { id: 3, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { id: 4, name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
  { id: 5, name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
  { id: 6, name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
  { id: 7, name: "Twitter", logo: "https://logo.clearbit.com/twitter.com" },
  { id: 8, name: "LinkedIn", logo: "https://logo.clearbit.com/linkedin.com" },
];

// Mock user data
const mockUserData = {
  id: 1,
  first_name: "Sarah",
  last_name: "Johnson",
  email: "sarah.johnson@stanford.edu",
  field: "Software Engineering",
  avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
  phone_number: "+1 (555) 123-4567",
  city: "Stanford",
  country: "United States",
  about:
    "Passionate software engineering student with a focus on web development and user experience. Currently pursuing a degree in Computer Science at Stanford University.",
  website: "https://sarahjohnson.dev",
  social_links: {
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
    twitter: "twitter.com/sarahjohnson",
  },
  stats: {
    total_applications: 15,
    interviews: 5,
    offers: 2,
    days_searching: 45,
  },
};

// Navigation Functions
function updateNavigation() {
  const hash = window.location.hash.slice(1) || "dashboard";
  currentSection = hash;
  console.log("Updating navigation to:", hash);

  // Update active link
  dom.navLinks.forEach((link) => {
    const isActive = link.dataset.section === hash;
    link.classList.toggle("text-indigo-600", isActive);
    link.classList.toggle("bg-indigo-50", isActive);
    link.classList.toggle("text-gray-600", !isActive);
    link.classList.toggle("hover:bg-gray-100", !isActive);
  });

  // Update page title
  const titles = {
    dashboard: "Dashboard",
    "my-applications": "My Applications",
    "user-profile": "User Profile",
    browse: "Find Internships",
    review: "Create Review",
  };
  dom.pageTitle.textContent = titles[hash] || "Dashboard";

  // Show/hide sections
  dom.sections.forEach((section) => {
    const isActive = section.id === `${hash}-section`;
    console.log(`Section ${section.id} active:`, isActive);
    section.style.display = isActive ? "block" : "none";
  });

  // Load section-specific content
  loadSectionContent(hash);

  ensureUserSidebarAndTopbar();
}

async function loadSectionContent(section) {
  showLoading(true);
  try {
    console.log("Loading section:", section);
    switch (section) {
      case "dashboard":
        await loadDashboardContent();
        break;
      case "my-applications":
        await loadApplicationForm();
        break;
      case "user-profile":
        await loadUserProfile();
        break;
      case "review":
        await loadReviewForm();
        break;
      case "browse":
        window.location.href = "/Frontend/pages/Browse/browse.html";
        break;
      default:
        console.warn("Unknown section:", section);
    }
  } catch (error) {
    console.error("Error loading section:", error);
    showError(error.message || "Failed to load content");
  } finally {
    showLoading(false);
  }
}

// Section Content Loading Functions
async function loadDashboardContent() {
  console.log("Loading dashboard content");
  try {
    // Use mock data for now
    currentUser = { data: mockUserData };
    updateUserProfile(currentUser.data);

    // Update stats with mock data
    const stats = {
      total: mockUserData.stats.total_applications,
      interviews: mockUserData.stats.interviews,
      offers: mockUserData.stats.offers,
      days_searching: mockUserData.stats.days_searching,
    };
    updateStatsCards(stats);

    // Update recent applications with mock data
    const applications = mockProfileData.applications.map((app) => ({
      id: app.id,
      company_name: app.company,
      company_logo_url: app.company_logo,
      internship_title: app.position,
      submission_date: app.date,
      status: app.status,
    }));
    updateRecentApplications(applications);

    // Update status bars with mock data
    const statusData = {
      total: mockUserData.stats.total_applications,
      pending: 5,
      reviewed: 4,
      interview: 3,
      offer: 2,
      rejected: 1,
    };
    updateStatusBars(statusData);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    throw error;
  }
}

// Application Form Functions
async function loadApplicationForm() {
  try {
    showLoading(true);
    const applicationForm = document.getElementById("applicationForm");
    const internshipInfoCard = document.getElementById("internshipInfoCard");

    // Check for pre-filled internship data
    const preFilledData = JSON.parse(
      localStorage.getItem("selectedInternship") || "null"
    );
    console.log("Pre-filled data:", preFilledData); // Debug log

    if (!preFilledData) {
      internshipInfoCard.innerHTML = `
                <div class="p-8 text-center">
                    <div class="mb-4">
                        <i class="fas fa-briefcase text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">No Internship Selected</h3>
                    <p class="text-gray-600 mb-4">Please select an internship from the browse page to apply</p>
                    <a href="/Frontend/pages/Browse/browse.html" 
                       class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <i class="fas fa-search mr-2"></i>
                        Browse Internships
                    </a>
                </div>
            `;
      applicationForm.style.display = "none";
      return;
    }

    // Fetch complete internship details
    const response = await dashboardAPI.getInternshipDetails(preFilledData.id);
    console.log("Internship Details Response:", response); // Debug log

    if (!response.success) {
      throw new Error(response.error || "Failed to load internship details");
    }

    const internshipDetails = response.data;
    console.log("Internship Details:", internshipDetails); // Debug log

    // Update internship information card
    document.getElementById("companyName").textContent =
      internshipDetails.company || "Company Name";
    document.getElementById("internshipTitle").textContent =
      internshipDetails.title || "Internship Title";
    document.getElementById("internshipType").textContent =
      internshipDetails.type || "Not specified";
    document.getElementById("internshipLocation").textContent =
      internshipDetails.location || "Location not specified";
    document.getElementById("internshipCategory").textContent =
      internshipDetails.category || "Category not specified";
    document.getElementById("internshipDescription").textContent =
      internshipDetails.description || "No description available";

    // Format and display salary
    const salaryElement = document.getElementById("internshipSalary");
    if (salaryElement) {
      if (internshipDetails.salary_range) {
        salaryElement.textContent = internshipDetails.salary_range;
      } else if (internshipDetails.salary) {
        const salary =
          typeof internshipDetails.salary === "number"
            ? internshipDetails.salary.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })
            : internshipDetails.salary;
        salaryElement.textContent = salary;
      } else {
        salaryElement.textContent = "Salary Range: Not specified";
      }
    }

    // Format and display posted date
    const postedDateElement = document.getElementById("internshipPostedDate");
    if (postedDateElement) {
      if (internshipDetails.created_at) {
        postedDateElement.textContent = new Date(
          internshipDetails.created_at
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else {
        postedDateElement.textContent = "Date not specified";
      }
    }

    // Set company logo with improved handling
    const companyLogo = document.getElementById("companyLogo");
    if (companyLogo) {
      const companyName = internshipDetails.company || "Company";
      console.log("Setting logo for company:", companyName); // Debug log

      // Get logo URL
      const logoUrl = internshipDetails.company_logo;
      console.log("Using logo URL:", logoUrl); // Debug log

      if (logoUrl) {
        // Set the logo source directly
        companyLogo.src = logoUrl;
        companyLogo.alt = `${companyName} logo`;
        companyLogo.classList.remove("hidden");
        companyLogo.style.display = "block";
        companyLogo.style.width = "100%";
        companyLogo.style.height = "100%";
        companyLogo.style.objectFit = "contain";
        companyLogo.style.backgroundColor = "white";
        companyLogo.style.padding = "8px";
        companyLogo.style.borderRadius = "0.5rem";

        // Add error handling
        companyLogo.onerror = () => {
          console.error("Error loading logo for:", companyName);
          setFallbackLogo(companyName);
        };
      } else {
        console.log("No logo URL found, using fallback");
        setFallbackLogo(companyName);
      }
    } else {
      console.error("Company logo element not found");
    }

    // Set hidden form fields
    document.getElementById("companyId").value = internshipDetails.company_id;
    document.getElementById("internshipId").value = internshipDetails.id;

    // Show the form
    applicationForm.style.display = "block";

    // Load existing applications
    await loadApplications();
  } catch (error) {
    console.error("Error loading application form:", error);
    showError(
      error.message || "Failed to load internship details. Please try again."
    );
  } finally {
    showLoading(false);
  }
}

// Helper function to set fallback logo
function setFallbackLogo(companyName) {
  const companyLogo = document.getElementById("companyLogo");
  if (companyLogo) {
    console.log("Setting fallback logo for:", companyName);

    // Generate initials from company name
    const initials = companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    // Create a colored background based on company name
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    const colorIndex =
      companyName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    const bgColor = colors[colorIndex];

    // Create fallback div with explicit dimensions and styling
    const fallbackDiv = document.createElement("div");
    fallbackDiv.className = `w-full h-full flex items-center justify-center ${bgColor} text-white font-bold text-xl rounded-lg`;
    fallbackDiv.style.minHeight = "100px";
    fallbackDiv.style.width = "100%";
    fallbackDiv.style.padding = "8px";
    fallbackDiv.style.backgroundColor = colors[colorIndex].replace("bg-", "");
    fallbackDiv.style.borderRadius = "0.5rem";
    fallbackDiv.textContent = initials;

    // Replace the img element with the fallback div
    companyLogo.parentNode.replaceChild(fallbackDiv, companyLogo);
  }
}

async function loadInternships(companyId, preFilledData = null) {
  try {
    const internships = await dashboardAPI.getCompanyInternships(companyId);
    const internshipSelect = document.getElementById("internship");

    if (!internshipSelect) {
      throw new Error("Internship select element not found");
    }

    // Clear existing options
    internshipSelect.innerHTML = '<option value="">Select a position</option>';

    if (Array.isArray(internships) && internships.length > 0) {
      internships.forEach((internship) => {
        const option = document.createElement("option");
        option.value = internship.id;
        option.textContent = internship.title;
        internshipSelect.appendChild(option);
      });

      // If we have pre-filled data, select the matching internship
      if (preFilledData) {
        const matchingInternship = internships.find(
          (i) => i.title === preFilledData.title
        );
        if (matchingInternship) {
          internshipSelect.value = matchingInternship.id;
        }
      }
    } else {
      console.warn("No internships found for selected company");
      showError("No internships available for this company at the moment.");
    }
  } catch (error) {
    console.error("Error loading internships:", error);
    showError("Failed to load internships. Please try again.");
  }
}

async function handleApplicationSubmit(event) {
  event.preventDefault();
  console.log("Form submission started");
  showLoading(true);

  try {
    const form = event.target;
    console.log("Form element:", form);

    const formData = new FormData(form);
    console.log("FormData object created");

    // Debug log all form data
    console.log("Form Data Contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Get the current user ID
    const userId = currentUser?.data?.id;
    console.log("Current User ID:", userId);
    console.log("Current User Data:", currentUser);

    if (!userId) {
      throw new Error("User not logged in");
    }

    // Get company and internship IDs from hidden fields
    const companyId = formData.get("company_id");
    const internshipId = formData.get("internship_id");
    console.log("Company ID:", companyId);
    console.log("Internship ID:", internshipId);

    if (!companyId || !internshipId) {
      throw new Error("Please select an internship to apply for");
    }

    // Validate resume link
    const resumeLink = formData.get("resume_link");
    console.log("Resume Link:", resumeLink);

    if (!resumeLink || !resumeLink.trim()) {
      throw new Error("Please provide your resume link");
    }
    if (!isValidUrl(resumeLink)) {
      throw new Error("Please provide a valid URL for your resume");
    }

    // Validate cover letter
    const coverLetter = formData.get("cover_letter");
    console.log("Cover Letter Length:", coverLetter?.length);

    if (!coverLetter || coverLetter.trim().length < 50) {
      throw new Error("Please write a cover letter (minimum 50 characters)");
    }

    // Prepare application data
    const applicationData = {
      company_id: parseInt(companyId),
      user_id: userId,
      internship_id: parseInt(internshipId),
      status: "pending",
      resume_url: resumeLink,
      cover_letter: coverLetter,
      submission_date: new Date().toISOString().split("T")[0],
    };

    console.log("Final Application Data:", applicationData);

    // Submit application
    console.log("Calling dashboardAPI.createApplication...");
    const response = await dashboardAPI.createApplication(applicationData);
    console.log("Application submission response:", response);

    if (!response || !response.success) {
      throw new Error(response?.error || "Failed to submit application");
    }

    // Clear the stored internship data only after successful submission
    localStorage.removeItem("selectedInternship");

    // Show success message
    showError("Application submitted successfully!");

    // Reset form and clear internship info
    resetApplicationForm();

    // Reload applications list
    await loadApplications();
  } catch (error) {
    console.error("Application submission error:", error);
    showError(
      error.message || "Failed to submit application. Please try again."
    );
  } finally {
    showLoading(false);
  }
}

// Add new function to reset the application form
function resetApplicationForm() {
  const form = document.getElementById("applicationForm");
  const internshipInfoCard = document.getElementById("internshipInfoCard");

  // Reset form fields
  if (form) {
    form.reset();
    updateCoverLetterCount();
  }

  // Clear internship info card
  if (internshipInfoCard) {
    internshipInfoCard.innerHTML = `
            <div class="p-8 text-center">
                <div class="mb-4">
                    <i class="fas fa-briefcase text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Select an Internship</h3>
                <p class="text-gray-600 mb-4">Choose an internship from the browse page to apply</p>
                <a href="/Frontend/pages/Browse/browse.html" 
                   class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <i class="fas fa-search mr-2"></i>
                    Browse Internships
                </a>
            </div>
        `;
  }

  // Hide the form initially
  if (form) {
    form.style.display = "none";
  }
}

// Add URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function loadApplications() {
  try {
    console.log("Loading applications...");
    console.log("Current user:", currentUser);

    if (!currentUser?.data?.id) {
      console.error("User data not available");
      showError("Please log in to view your applications");
      return;
    }

    const response = await dashboardAPI.getRecentApplications(
      currentUser.data.id
    );
    console.log("Applications response:", response);

    if (!response || !response.data) {
      console.error("Invalid response from API");
      showError("Failed to load applications. Please try again later.");
      return;
    }

    updateApplicationsTable(response.data);
  } catch (error) {
    console.error("Error loading applications:", error);
    showError("Failed to load applications. Please try again later.");
  }
}

function updateApplicationsTable(applications) {
  const tbody = document.getElementById("applicationsBody");
  if (!tbody) return;

  // Ensure applications is an array
  const applicationsArray = Array.isArray(applications) ? applications : [];

  if (applicationsArray.length === 0) {
    // Show a message when there are no applications
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
          <div class="flex flex-col items-center justify-center py-8">
            <i class="fas fa-file-alt text-4xl text-gray-400 mb-3"></i>
            <p class="text-lg font-medium text-gray-900 mb-1">No Applications Yet</p>
            <p class="text-sm text-gray-600">Start applying to internships to see them here</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = applicationsArray
    .map(
      (app) => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <img class="h-10 w-10 rounded-lg object-contain bg-white p-1" 
               src="${
                 app.company_logo_url || "https://via.placeholder.com/40"
               }" 
               alt="${app.company_name || "Company"}">
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${
              app.company_name || "Company Name"
            }</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${
          app.internship_title || "Position"
        }</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">${
          app.submission_date
            ? new Date(app.submission_date).toLocaleDateString()
            : "N/A"
        }</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
          app.status || "pending"
        )}">
          ${app.status || "Pending"}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div class="flex items-center space-x-3">
          <button class="text-indigo-600 hover:text-indigo-900 transition-colors" 
                  onclick="viewApplication(${app.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="text-gray-600 hover:text-gray-900 transition-colors" 
                  onclick="downloadApplication(${app.id})">
            <i class="fas fa-download"></i>
          </button>
          <button class="text-red-600 hover:text-red-900 transition-colors" 
                  onclick="withdrawApplication(${app.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

function filterApplications(searchTerm, status) {
  const rows = document.querySelectorAll("#applicationsBody tr");
  rows.forEach((row) => {
    const company = row
      .querySelector("td:first-child")
      .textContent.toLowerCase();
    const position = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const appStatus = row
      .querySelector("td:nth-child(4) span")
      .textContent.toLowerCase();

    const matchesSearch =
      company.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase());
    const matchesStatus =
      status === "all" || appStatus === status.toLowerCase();

    row.style.display = matchesSearch && matchesStatus ? "" : "none";
  });
}

async function viewApplication(id) {
  try {
    const application = await dashboardAPI.getApplication(id);
    // Implement view application modal
    console.log("View application:", application);
  } catch (error) {
    console.error("Error viewing application:", error);
    showError("Failed to load application details");
  }
}

async function downloadApplication(id) {
  try {
    const application = await dashboardAPI.getApplication(id);
    // Implement download functionality
    console.log("Download application:", application);
  } catch (error) {
    console.error("Error downloading application:", error);
    showError("Failed to download application");
  }
}

async function withdrawApplication(id) {
  if (confirm("Are you sure you want to withdraw this application?")) {
    try {
      await dashboardAPI.withdrawApplication(id);
      showError("Application withdrawn successfully");
      await loadApplications();
    } catch (error) {
      console.error("Error withdrawing application:", error);
      showError("Failed to withdraw application");
    }
  }
}

// Load user profile data
async function loadUserProfile() {
  console.log("Loading user profile");
  showLoading();

  try {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!userData || !userData.id) {
      throw new Error("User not logged in");
    }

    const response = await dashboardAPI.getCurrentUser();
    if (!response.success) {
      throw new Error(response.message || "Failed to load profile");
    }

    const profile = response.data;
    console.log("User profile data:", profile);

    // Update profile header
    document.getElementById(
      "profileName"
    ).textContent = `${profile.first_name} ${profile.last_name}`;
    document.getElementById("profileTitle").textContent =
      profile.role || "Intern";

    // Update sidebar profile
    const sidebarAvatar = document.querySelector(".user-avatar");
    const sidebarName = document.querySelector(".user-name");
    const sidebarMajor = document.querySelector(".user-major");
    if (sidebarAvatar)
      sidebarAvatar.src =
        profile.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile.first_name + " " + profile.last_name
        )}&background=6366f1&color=fff`;
    if (sidebarName)
      sidebarName.textContent = `${profile.first_name} ${profile.last_name}`;
    if (sidebarMajor) sidebarMajor.textContent = profile.role || "Student";

    // Update top-right corner profile
    const topRightAvatar = document.querySelector("header .rounded-full");
    const topRightName = document.querySelector("header .hidden.md\\:inline");
    if (topRightAvatar)
      topRightAvatar.src =
        profile.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile.first_name + " " + profile.last_name
        )}&background=6366f1&color=fff`;
    if (topRightName)
      topRightName.textContent = `${
        profile.first_name
      } ${profile.last_name.charAt(0)}.`;

    // Update about section
    const aboutText = profile.about || "No description available";
    document.getElementById("profileAbout").textContent = aboutText;

    // Update contact information
    const contactInfo = document.getElementById("profileContact");
    contactInfo.innerHTML = `
      <div class="flex items-center space-x-3">
        <i class="fas fa-envelope text-indigo-600"></i>
        <span class="text-gray-600">${profile.email}</span>
      </div>
      ${
        profile.phone_number
          ? `
        <div class="flex items-center space-x-3">
          <i class="fas fa-phone text-indigo-600"></i>
          <span class="text-gray-600">${profile.phone_number}</span>
        </div>
      `
          : ""
      }
      ${
        profile.city || profile.country
          ? `
        <div class="flex items-center space-x-3">
          <i class="fas fa-map-marker-alt text-indigo-600"></i>
          <span class="text-gray-600">${[profile.city, profile.country]
            .filter(Boolean)
            .join(", ")}</span>
        </div>
      `
          : ""
      }
    `;

    // Update skills
    const skillsContainer = document.getElementById("profileSkills");
    if (profile.skills && profile.skills.length > 0) {
      skillsContainer.innerHTML = profile.skills
        .map(
          (skill) => `
        <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
        ${skill}
      </span>
    `
        )
        .join("");
    } else {
      skillsContainer.innerHTML =
        '<p class="text-gray-500">No skills added yet</p>';
    }

    // Update social links
    const socialContainer = document.getElementById("profileSocial");
    socialContainer.innerHTML = `
      ${
        profile.linkedin
          ? `
        <a href="${profile.linkedin}" target="_blank" class="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 transition-colors">
          <i class="fab fa-linkedin text-2xl"></i>
          <span>LinkedIn Profile</span>
        </a>
      `
          : ""
      }
      ${
        profile.website
          ? `
        <a href="${profile.website}" target="_blank" class="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 transition-colors">
          <i class="fas fa-globe text-2xl"></i>
          <span>Personal Website</span>
        </a>
      `
          : ""
      }
      ${
        !profile.linkedin && !profile.website
          ? '<p class="text-gray-500">No social links added yet</p>'
          : ""
      }
    `;

    // Update edit form fields
    const form = document.getElementById("editProfileForm");
    if (form) {
      form.first_name.value = profile.first_name || "";
      form.last_name.value = profile.last_name || "";
      form.email.value = profile.email || "";
      form.phone_number.value = profile.phone_number || "";
      form.city.value = profile.city || "";
      form.country.value = profile.country || "";
      form.about.value = profile.about || "";
      form.linkedin.value = profile.linkedin || "";
      form.website.value = profile.website || "";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    showError("Failed to load profile. Please try again later.");
  } finally {
    showLoading(false);
  }
}

async function loadReviewForm() {
  console.log("Loading review form");
  try {
    // In a real app, this would be an API call
    // const response = await dashboardAPI.getCompanies();
    // const companies = response.data;
    const companies = mockCompanies;

    // Populate company dropdown
    const companySelect = document.querySelector('select[name="company"]');
    companySelect.innerHTML = `
      <option value="">Select a company</option>
      ${companies
        .map(
          (company) => `
        <option value="${company.id}">${company.name}</option>
      `
        )
        .join("")}
    `;

    // Initialize star rating
    const stars = document.querySelectorAll(".rating-stars i");
    const ratingInput = document.getElementById("ratingInput");
    const ratingText = document.getElementById("ratingText");

    stars.forEach((star) => {
      star.addEventListener("mouseover", () => {
        const rating = star.dataset.rating;
        updateStars(rating);
        updateRatingText(rating);
      });

      star.addEventListener("mouseout", () => {
        const currentRating = ratingInput.value || 0;
        updateStars(currentRating);
        updateRatingText(currentRating);
      });

      star.addEventListener("click", () => {
        const rating = star.dataset.rating;
        ratingInput.value = rating;
        updateStars(rating);
        updateRatingText(rating);
      });
    });

    // Handle review content character count
    const reviewContent = document.querySelector('textarea[name="posts"]');
    const reviewCount = document.getElementById("reviewCount");
    reviewContent.addEventListener("input", (e) => {
      const count = e.target.value.length;
      reviewCount.textContent = count;
      if (count > 1000) {
        e.target.value = e.target.value.substring(0, 1000);
        reviewCount.textContent = "1000";
        showError("Review cannot exceed 1000 characters");
      }
    });

    // Handle profile URL generation
    const profileUrlInput = document.querySelector('input[name="profile_url"]');
    const generateUrlButton =
      document.querySelector("button i.fa-link").parentElement;
    if (generateUrlButton) {
      generateUrlButton.addEventListener("click", () => {
        const fullName = document.querySelector(
          'input[name="full_name"]'
        ).value;
        if (fullName) {
          const url = `https://internhub.com/users/${fullName
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
          profileUrlInput.value = url;
        } else {
          showError("Please enter your full name first");
        }
      });
    }

    // Handle guidelines modal
    const guidelinesButton = document.querySelector(
      "button i.fa-question-circle"
    ).parentElement;
    if (guidelinesButton) {
      guidelinesButton.addEventListener("click", openGuidelinesModal);
    }

    // Add form submission handler
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
      reviewForm.onsubmit = handleReviewSubmit;
    }
  } catch (error) {
    console.error("Error loading review form:", error);
    showError("Failed to load review form");
  }
}

function updateStars(rating) {
  const stars = document.querySelectorAll(".rating-stars i");
  stars.forEach((star) => {
    const starRating = star.dataset.rating;
    star.classList.toggle("text-yellow-400", starRating <= rating);
    star.classList.toggle("text-gray-300", starRating > rating);
  });
}

function updateRatingText(rating) {
  const ratingText = document.getElementById("ratingText");
  const ratings = {
    0: "Select a rating",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  ratingText.textContent = ratings[rating] || ratings[0];
}

function openGuidelinesModal() {
  const modal = document.getElementById("guidelinesModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Add click outside listener
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeGuidelinesModal();
    }
  });

  // Add escape key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeGuidelinesModal();
    }
  });

  // Add close button listener
  const closeButton = modal.querySelector("button");
  if (closeButton) {
    closeButton.addEventListener("click", closeGuidelinesModal);
  }
}

function closeGuidelinesModal() {
  const modal = document.getElementById("guidelinesModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");

  // Remove event listeners
  modal.removeEventListener("click", closeGuidelinesModal);
  document.removeEventListener("keydown", closeGuidelinesModal);

  // Remove close button listener
  const closeButton = modal.querySelector("button");
  if (closeButton) {
    closeButton.removeEventListener("click", closeGuidelinesModal);
  }
}

async function handleReviewSubmit(event) {
  event.preventDefault();
  showLoading(true);

  try {
    const formData = new FormData(event.target);
    const reviewData = {
      profile_url: formData.get("profile_url"),
      full_name: formData.get("full_name"),
      occupation: formData.get("occupation"),
      company: formData.get("company"),
      posts: formData.get("posts"),
      rating: parseFloat(formData.get("rating")),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Validate data
    if (!reviewData.rating || reviewData.rating < 0 || reviewData.rating > 5) {
      throw new Error("Please select a valid rating between 0 and 5");
    }

    if (!reviewData.posts || reviewData.posts.length < 10) {
      throw new Error(
        "Please write a more detailed review (minimum 10 characters)"
      );
    }

    // In a real app, this would be an API call
    // await dashboardAPI.submitReview(reviewData);
    console.log("Submitting review:", reviewData);

    showError("Review submitted successfully!");
    event.target.reset();
    document.getElementById("ratingInput").value = "";
    updateStars(0);
    updateRatingText(0);
    document.getElementById("reviewCount").textContent = "0";
  } catch (error) {
    console.error("Error submitting review:", error);
    showError(error.message || "Failed to submit review");
  } finally {
    showLoading(false);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded");

  try {
    // Initialize user data
    currentUser = { data: mockUserData };
    console.log("User data initialized:", currentUser);

    // Initialize application form
    const applicationForm = document.getElementById("applicationForm");
    if (applicationForm) {
      console.log("Application form found, attaching submit handler");
      applicationForm.addEventListener("submit", handleApplicationSubmit);
    } else {
      console.error("Application form not found");
    }

    // Sidebar Toggle
    dom.sidebarToggle.addEventListener("click", () => {
      dom.sidebar.classList.toggle("sidebar-expanded");
      dom.sidebar.classList.toggle("sidebar-collapsed");
      dom.mainContent.classList.toggle("md:ml-64");
      dom.mainContent.classList.toggle("md:ml-20");
    });

    // Navigation
    dom.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        console.log("Navigation clicked:", section);
        window.location.hash = section;
      });
    });

    // Handle hash changes
    window.addEventListener("hashchange", updateNavigation);

    // Initial navigation
    updateNavigation();

    // Add click handler for application view
    if (dom.applicationsBody) {
      dom.applicationsBody.addEventListener("click", (event) => {
        if (event.target.closest('[data-action="view-application"]')) {
          handleViewApplication(event);
        }
      });
    }

    // Add modal event listeners
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileForm = document.getElementById("editProfileForm");
    const closeModalBtn = document.querySelector(
      '#editProfileModal button[onclick="closeEditModal()"]'
    );

    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", openEditModal);
    }

    if (editProfileForm) {
      editProfileForm.addEventListener("submit", handleProfileUpdate);
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeEditModal);
    }

    // Add logout button handler
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    }

    // Add resume file input handler
    const resumeInput = document.getElementById("resume");
    if (resumeInput) {
      resumeInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            showError("File size must be less than 5MB");
            e.target.value = "";
            updateResumeFileName(null);
          } else {
            updateResumeFileName(file);
          }
        }
      });

      // Add drag and drop handlers
      const dropZone = resumeInput.closest("label");
      if (dropZone) {
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
          dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
          e.preventDefault();
          e.stopPropagation();
        }

        ["dragenter", "dragover"].forEach((eventName) => {
          dropZone.addEventListener(eventName, () => {
            dropZone.classList.add("border-indigo-500", "bg-indigo-50");
          });
        });

        ["dragleave", "drop"].forEach((eventName) => {
          dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove("border-indigo-500", "bg-indigo-50");
          });
        });

        dropZone.addEventListener("drop", (e) => {
          const file = e.dataTransfer.files[0];
          if (file) {
            resumeInput.files = e.dataTransfer.files;
            const event = new Event("change");
            resumeInput.dispatchEvent(event);
          }
        });
      }
    }

    // Add cover letter character count handler
    const coverLetter = document.getElementById("coverLetter");
    if (coverLetter) {
      coverLetter.addEventListener("input", updateCoverLetterCount);
    }

    // Add resume link validation
    const resumeLink = document.getElementById("resumeLink");
    if (resumeLink) {
      resumeLink.addEventListener("blur", () => {
        if (resumeLink.value && !isValidUrl(resumeLink.value)) {
          showError("Please enter a valid URL for your resume");
        }
      });
    }

    ensureUserSidebarAndTopbar();
  } catch (error) {
    console.error("Error during initialization:", error);
    showError("Failed to initialize the application. Please refresh the page.");
  }
});

// DOM Updates
function updateUserProfile(user) {
  // Update sidebar profile
  const sidebarAvatar = document.querySelector(".user-avatar");
  const sidebarName = document.querySelector(".user-name");
  const sidebarMajor = document.querySelector(".user-major");

  if (sidebarAvatar) sidebarAvatar.src = user.avatar_url;
  if (sidebarName)
    sidebarName.textContent = `${user.first_name} ${user.last_name}`;
  if (sidebarMajor) sidebarMajor.textContent = user.field;

  // Update top-right corner profile
  const topRightAvatar = document.querySelector("header .rounded-full");
  const topRightName = document.querySelector("header .hidden.md\\:inline");

  if (topRightAvatar) topRightAvatar.src = user.avatar_url;
  if (topRightName)
    topRightName.textContent = `${user.first_name} ${user.last_name.charAt(
      0
    )}.`;

  // Update welcome message
  const welcomeName = document.querySelector("[data-welcome-name]");
  const welcomeStats = document.querySelector("[data-welcome-stats]");

  if (welcomeName)
    welcomeName.textContent = `Welcome back, ${user.first_name}!`;
  if (welcomeStats) {
    welcomeStats.textContent = `You've applied to ${user.stats.total_applications} internships, with ${user.stats.interviews} interviews and ${user.stats.offers} offers.`;
  }
}

function updateStatsCards(stats) {
  const statsConfig = [
    {
      title: "Total Applications",
      value: stats.total || 0,
      icon: "fa-file-alt",
      color: "indigo",
    },
    {
      title: "Interview Rate",
      value: stats.total
        ? `${Math.round((stats.interviews / stats.total) * 100)}%`
        : "0%",
      icon: "fa-handshake",
      color: "purple",
    },
    {
      title: "Offer Rate",
      value: stats.total
        ? `${Math.round((stats.offers / stats.total) * 100)}%`
        : "0%",
      icon: "fa-trophy",
      color: "green",
    },
    {
      title: "Days Searching",
      value: stats.days_searching || 0,
      icon: "fa-calendar-day",
      color: "blue",
    },
  ];

  if (dom.statsContainer) {
    dom.statsContainer.innerHTML = statsConfig
      .map(
        (card) => `
    <div class="bg-white rounded-lg shadow p-5 card-hover">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">${card.title}</p>
          <p class="text-2xl font-bold mt-1">${card.value}</p>
        </div>
        <div class="p-3 rounded-full bg-${card.color}-100 text-${card.color}-600">
          <i class="fas ${card.icon}"></i>
        </div>
      </div>
    </div>
  `
      )
      .join("");
  }
}

function updateRecentApplications(applications) {
  if (dom.applicationsBody) {
    dom.applicationsBody.innerHTML = applications
      .map(
        (app) => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <img class="h-10 w-10 rounded-full" 
               src="${app.company_logo_url}" 
               alt="${app.company_name}">
          <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${
                app.company_name
              }</div>
            </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">${app.internship_title}</td>
        <td class="px-6 py-4 whitespace-nowrap">${new Date(
          app.submission_date
        ).toLocaleDateString()}</td>
      <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
            app.status
          )}">
          ${app.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-indigo-600 hover:text-indigo-900 mr-3" 
                data-action="view-application" 
                data-id="${app.id}">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `
      )
      .join("");
  }
}

function updateStatusBars(status) {
  if (dom.statusBarsContainer) {
    const total = status.total || 1; // Prevent division by zero
    const statuses = [
      { type: "pending", label: "Pending", count: status.pending || 0 },
      { type: "reviewed", label: "Reviewed", count: status.reviewed || 0 },
      { type: "interview", label: "Interview", count: status.interview || 0 },
      { type: "offer", label: "Offer", count: status.offer || 0 },
      { type: "rejected", label: "Rejected", count: status.rejected || 0 },
    ];

    dom.statusBarsContainer.innerHTML = statuses
      .map(
        (s) => `
    <div class="mb-4">
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">${s.label}</span>
        <span class="text-sm font-medium text-gray-700">${s.count}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="h-2.5 rounded-full bg-${getStatusColor(s.type)}" 
             style="width: ${(s.count / total) * 100}%"></div>
      </div>
    </div>
  `
      )
      .join("");
  }
}

// Helper Functions
function getStatusClass(status) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    interview: "bg-purple-100 text-purple-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return classes[status.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function getStatusColor(status) {
  const colors = {
    pending: "yellow-600",
    reviewed: "blue-600",
    interview: "purple-600",
    offer: "green-600",
    rejected: "red-600",
  };
  return colors[status] || "gray-600";
}

// Event Listeners
function handleViewApplication(event) {
  const appId = event.target.closest("[data-id]").dataset.id;
  // Implement application viewing logic
  console.log("View application:", appId);
}

// Profile Management
function openEditModal() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Populate form with current profile data
  if (currentProfile) {
    const form = document.getElementById("editProfileForm");
    form.first_name.value = currentProfile.first_name;
    form.last_name.value = currentProfile.last_name;
    form.email.value = currentProfile.email;
    form.phone_number.value = currentProfile.phone_number || "";
    form.city.value = currentProfile.city || "";
    form.country.value = currentProfile.country || "";
    form.linkedin.value = currentProfile.social_links?.linkedin || "";
    form.website.value = currentProfile.website || "";
    form.about.value = currentProfile.about || "";
    form.skills.value = currentProfile.skills?.join(", ") || "";
  }

  // Add click outside listener
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeEditModal();
    }
  });

  // Add escape key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEditModal();
    }
  });
}

function closeEditModal() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");

  // Remove event listeners
  modal.removeEventListener("click", closeEditModal);
  document.removeEventListener("keydown", closeEditModal);
}

async function handleProfileUpdate(event) {
  event.preventDefault();
  showLoading(true);

  try {
    const formData = new FormData(event.target);
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!userData?.id) {
      throw new Error("User not logged in");
    }

    // Build profileData with only non-empty fields
    const profileData = {};
    for (let [key, value] of formData.entries()) {
      if (value && value.trim() !== "") {
        profileData[key] = value;
      }
    }

    // Special handling for social_links (LinkedIn)
    if (profileData.linkedin) {
      profileData.social_links = { linkedin: profileData.linkedin };
      delete profileData.linkedin;
    }

    // Special handling for skills (if present)
    if (profileData.skills) {
      profileData.skills = profileData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Update profile through API
    const response = await dashboardAPI.updateUser(userData.id, profileData);
    if (!response.success) {
      throw new Error(response.error || "Failed to update profile");
    }

    // Update local storage with new user data (merge changes)
    const updatedUserData = { ...userData, ...profileData };
    localStorage.setItem("user_data", JSON.stringify(updatedUserData));

    // Refresh profile display
    await loadUserProfile();

    showError("Profile updated successfully!");
    closeEditModal();
  } catch (error) {
    console.error("Error updating profile:", error);
    showError(error.message || "Failed to update profile");
  } finally {
    showLoading(false);
  }
}

// Handle avatar upload
async function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    showLoading();
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await dashboardAPI.updateProfile(formData);
    if (!response.success) {
      throw new Error(response.message || "Failed to update avatar");
    }

    // Update avatar display
    document.getElementById("profileAvatar").src = response.data.avatar_url;
    showError("Profile picture updated successfully");
  } catch (error) {
    console.error("Error uploading avatar:", error);
    showError("Failed to update profile picture. Please try again.");
  } finally {
    showLoading(false);
  }
}

function updateResumeFileName(file) {
  const fileNameDisplay = document.getElementById("resumeFileName");
  if (fileNameDisplay) {
    if (file) {
      fileNameDisplay.innerHTML = `
                <div class="flex items-center text-green-600">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>${file.name}</span>
                    <button type="button" class="ml-2 text-gray-400 hover:text-gray-600" onclick="clearResumeFile()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
    } else {
      fileNameDisplay.textContent = "";
    }
  }
}

function clearResumeFile() {
  const resumeInput = document.getElementById("resume");
  if (resumeInput) {
    resumeInput.value = "";
    updateResumeFileName(null);
  }
}

function updateCoverLetterCount() {
  const coverLetter = document.getElementById("coverLetter");
  const countDisplay = document.getElementById("coverLetterCount");
  if (coverLetter && countDisplay) {
    const count = coverLetter.value.length;
    countDisplay.textContent = count;

    // Add visual feedback when approaching limit
    if (count > 900) {
      countDisplay.classList.add("text-red-500");
    } else {
      countDisplay.classList.remove("text-red-500");
    }
  }
}

// Add this new function for handling logout
async function handleLogout() {
  try {
    // Clear user data
    currentUser = null;

    // Clear any stored data
    localStorage.removeItem("selectedInternship");
    localStorage.removeItem("user_data");

    // Show success message
    showError("Logged out successfully!");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "/Frontend/pages/Login/login.html";
    }, 1000);
  } catch (error) {
    console.error("Error during logout:", error);
    showError("Failed to logout. Please try again.");
  }
}

function updateUserSidebarAndTopbar(userData) {
  // Sidebar
  const sidebarAvatar = document.querySelector(".user-avatar");
  const sidebarName = document.querySelector(".user-name");
  const sidebarMajor = document.querySelector(".user-major");
  if (sidebarAvatar)
    sidebarAvatar.src =
      userData.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.first_name + " " + userData.last_name
      )}&background=6366f1&color=fff`;
  if (sidebarName)
    sidebarName.textContent = `${userData.first_name} ${userData.last_name}`;
  if (sidebarMajor) sidebarMajor.textContent = userData.role || "Student";
  // Top-right
  const topRightAvatar = document.querySelector("header .rounded-full");
  const topRightName = document.querySelector("header .hidden.md\\:inline");
  if (topRightAvatar)
    topRightAvatar.src =
      userData.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.first_name + " " + userData.last_name
      )}&background=6366f1&color=fff`;
  if (topRightName)
    topRightName.textContent = `${
      userData.first_name
    } ${userData.last_name.charAt(0)}.`;
}

// Call this on page load and navigation
function ensureUserSidebarAndTopbar() {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  if (userData && userData.first_name) {
    updateUserSidebarAndTopbar(userData);
  }
}
