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
};

// State
let currentUser = null;

// Utility Functions
const showLoading = (show) => {
  dom.loadingOverlay.classList.toggle("hidden", !show);
};

const showError = (message) => {
  dom.errorToast.textContent = message;
  dom.errorToast.classList.remove("hidden");
  setTimeout(() => dom.errorToast.classList.add("hidden"), 5000);
};

// Data Fetching
async function initializeDashboard() {
  showLoading(true);

  try {
    // Get current user
    currentUser = await dashboardAPI.getCurrentUser();
    updateUserProfile(currentUser.data);

    // Load all data in parallel
    const [stats, applications, status] = await Promise.all([
      dashboardAPI.getApplicationsStats(currentUser.data.id),
      dashboardAPI.getRecentApplications(currentUser.data.id),
      dashboardAPI.getApplicationsStats(currentUser.data.id),
    ]);

    updateStatsCards(stats.data);
    updateRecentApplications(applications.data);
    updateStatusBars(status.data);
    updateWelcomeMessage(stats.data);
  } catch (error) {
    showError(error.message || "Failed to load dashboard data");
  } finally {
    showLoading(false);
  }
}

// DOM Updates
function updateUserProfile(user) {
  // Update profile elements
  document.querySelectorAll(".user-name").forEach((el) => {
    el.textContent = `${user.first_name} ${user.last_name}`;
  });
  document.querySelector(".user-major").textContent = user.field;
  document.querySelectorAll(".user-avatar").forEach((img) => {
    img.src = user.avatar_url || "default-avatar.jpg";
  });
}

function updateStatsCards(stats) {
  const statsConfig = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: "fa-file-alt",
      color: "indigo",
    },
    {
      title: "Interview Rate",
      value: `${Math.round((stats.interviews / stats.total) * 100)}%`,
      icon: "fa-handshake",
      color: "purple",
    },
    {
      title: "Offer Rate",
      value: `${Math.round((stats.offers / stats.total) * 100)}%`,
      icon: "fa-trophy",
      color: "green",
    },
    {
      title: "Days Searching",
      value: stats.days_searching,
      icon: "fa-calendar-day",
      color: "blue",
    },
  ];

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

function updateRecentApplications(applications) {
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

function updateStatusBars(status) {
  const total = status.total || 1; // Prevent division by zero
  const statuses = [
    { type: "pending", label: "Pending", count: status.pending },
    { type: "reviewed", label: "Reviewed", count: status.reviewed },
    { type: "interview", label: "Interview", count: status.interview },
    { type: "offer", label: "Offer", count: status.offer },
    { type: "rejected", label: "Rejected", count: status.rejected },
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

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Toggle
  dom.sidebarToggle.addEventListener("click", () => {
    dom.sidebar.classList.toggle("sidebar-expanded");
    dom.sidebar.classList.toggle("sidebar-collapsed");
    dom.mainContent.classList.toggle("md:ml-64");
    dom.mainContent.classList.toggle("md:ml-20");
  });

  // Application Click Handler
  dom.applicationsBody.addEventListener("click", (event) => {
    if (event.target.closest('[data-action="view-application"]')) {
      handleViewApplication(event);
    }
  });

  // Initialize dashboard
  initializeDashboard();
});
