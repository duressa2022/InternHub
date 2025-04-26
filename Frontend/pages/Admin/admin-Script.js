import { DashboardApiService } from "../../apiRoutes/Api-Services/Dashboard-Service.js";

// Sidebar Toggle
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

toggleSidebar.addEventListener("click", function () {
  sidebar.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("sidebar-expanded");
  mainContent.classList.toggle("content-collapsed");
  mainContent.classList.toggle("content-expanded");
});

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const dom = {
    stats: {
      totalInternships: document.getElementById("totalInternships"),
      activeCompanies: document.getElementById("activeCompanies"),
      registeredStudents: document.getElementById("registeredStudents"),
      pendingApprovals: document.getElementById("pendingApprovals"),
    },
    companySelect: document.getElementById("company"),
    internshipsBody: document.getElementById("internshipsBody"),
    form: document.getElementById("internshipForm"),
    notificationContainer: document.getElementById("notificationContainer"),
  };

  await init();

  async function init() {
    try {
      await loadStats();
      await loadCompanies();
      await loadInternships();
      setupEventListeners();
    } catch (error) {
      showNotification(`Initialization failed: ${error.message}`, "error");
    }
  }

  async function loadStats() {
    try {
      const result = await DashboardApiService.getStats();
      if (result.success) {
        dom.stats.totalInternships.textContent = result.data.totalInternships;
        dom.stats.activeCompanies.textContent = result.data.activeCompanies;
        dom.stats.registeredStudents.textContent =
          result.data.registeredStudents;
        dom.stats.pendingApprovals.textContent = result.data.pendingApprovals;
      }
    } catch (error) {
      showNotification("Failed to load statistics", "error");
    }
  }

  async function loadCompanies() {
    try {
      const result = await DashboardApiService.getCompanies();
      if (result.success) {
        dom.companySelect.innerHTML =
          '<option value="">Select Company</option>' +
          result.data
            .map(
              (company) =>
                `<option value="${company.id}">${company.name}</option>`
            )
            .join("");
      }
    } catch (error) {
      showNotification("Failed to load companies", "error");
    }
  }

  async function loadInternships() {
    try {
      const result = await DashboardApiService.getInternships();
      if (result.success) {
        dom.internshipsBody.innerHTML = result.data
          .map(
            (internship) => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">${internship.title}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img src="${
                  internship.company.logo
                }" class="h-10 w-10 rounded-full">
                <div class="ml-4">${internship.company.name}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                internship.type
              )}">
                ${internship.type}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${internship.location}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                internship.status
              )}">
                ${internship.status}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
              <button class="text-red-600 hover:text-red-900" onclick="deleteInternship(${
                internship.id
              })">Delete</button>
            </td>
          </tr>
        `
          )
          .join("");
      }
    } catch (error) {
      showNotification("Failed to load internships", "error");
    }
  }

  function setupEventListeners() {
    // Dropdown Menus
    document.querySelectorAll('[id$="Dropdown"]').forEach((button) => {
      button.addEventListener("click", () => {
        const menu = document.getElementById(
          button.id.replace("Dropdown", "Menu")
        );
        if (menu) {
          menu.classList.toggle("show");
          button
            .querySelector(".fa-chevron-down")
            .classList.toggle("rotate-180");
        }
      });
    });

    // Form Submission
    dom.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(dom.form);

      const internshipData = {
        title: formData.get("title"),
        companyId: formData.get("company"),
        type: formData.get("type"),
        location: formData.get("location"),
        status: formData.get("status"),
        description: formData.get("description"),
        requirements: formData.get("requirements"),
        benefits: formData.get("benefits"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        salary: formData.get("salary"),
        application_deadline: formData.get("application_deadline"),
        application_link: formData.get("application_link"),
      };

      try {
        const result = await DashboardApiService.createInternship(
          internshipData
        );
        if (result.success) {
          showNotification("Internship created successfully!", "success");
          await loadStats();
          await loadInternships();
          dom.form.reset();
        }
      } catch (error) {
        showNotification("Failed to create internship", "error");
      }
    });
  }

  // Delete internship function
  window.deleteInternship = async (id) => {
    try {
      const result = await DashboardApiService.deleteInternship(id);
      if (result.success) {
        showNotification("Internship deleted successfully!", "success");
        await loadStats();
        await loadInternships();
      }
    } catch (error) {
      showNotification("Failed to delete internship", "error");
    }
  };

  function getStatusClass(type) {
    const statusClasses = {
      published: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      remote: "bg-purple-100 text-purple-800",
      hybrid: "bg-orange-100 text-orange-800",
    };
    return statusClasses[type] || "bg-gray-100 text-gray-800";
  }

  function showNotification(message, type = "success") {
    if (!dom.notificationContainer) return;

    const notification = document.createElement("div");
    notification.className = `p-4 rounded-lg mb-2 ${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`;
    notification.textContent = message;

    dom.notificationContainer.innerHTML = "";
    dom.notificationContainer.appendChild(notification);
    dom.notificationContainer.classList.remove("hidden");

    setTimeout(() => {
      dom.notificationContainer.classList.add("hidden");
    }, 3000);
  }
});
