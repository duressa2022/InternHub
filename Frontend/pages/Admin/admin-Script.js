import { DashboardApiService } from "../../apiRoutes/Api-Services/Dashboard-Service.js";
import { showNotification } from "../../Alert/showNotification.js";

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

let companies = [];

document.addEventListener("DOMContentLoaded", async () => {
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

    modal: {
      addCompany: document.getElementById("addCompanyModal"),
    },
    form: {
      internship: document.getElementById("internshipForm"),
      addCompany: document.getElementById("addCompanyForm"),
    },
    buttons: {
      openAddCompany: document.getElementById("openAddCompanyModal"),
      closeAddCompany: document.getElementById("closeAddCompanyModalBottom"),
      closeAddCompany: document.getElementById("closeXAddCompanyModal"),
    },
  };

  await init();

  async function init() {
    try {
      await loadStats();
      await loadCompanies();
      // await loaduser();
      await loadInternships();
      await loadAddCompanyFeature();
      await setupEventListeners();
    } catch (error) {
      showNotification(`Initialization failed: ${error.message}`, "error");
    }
  }

  async function loaduser() {
    // Retrieve the entire user data object from localStorage
    const userData = JSON.parse(localStorage.getItem("user_data"));

    // Check if the userData exists and has an id
    if (userData && userData.id) {
      const userId = userData.id; // Get the userId from the stored user data

      try {
        // Fetch the user data by ID from the backend API
        const user = await DashboardApiService.getUserById(userId);

        // Assuming the user object is inside 'data' from the API response
        const userDataFromAPI = user; // This is the 'data' object returned by the API

        // Extract user details from the API response
        const firstName = userDataFromAPI.first_name;
        const lastName = userDataFromAPI.last_name;

        console.log("user datatarar", firstName, lastName, userDataFromAPI);
        const role = userDataFromAPI.role || "Super Admin"; // Default to 'Super Admin' if no role is provided
        const imageUrl =
          userDataFromAPI.avater_url ||
          "https://randomuser.me/api/portraits/women/44.jpg"; // Default image if not provided

        // Insert the user data into the HTML
        document.querySelector(
          ".user-name"
        ).textContent = `${firstName} ${lastName}`;
        document.querySelector(".user-role").textContent = role;
        document.querySelector(".user-image").src = imageUrl;
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    } else {
      console.error("User ID not found in localStorage");
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
      console.log("Company list Result: ", result);
      companies = result.data.data; // Store the companies in the global variable
      dom.companySelect.innerHTML =
        '<option value="">Select Company</option>' +
        companies
          .map(
            (company) =>
              `<option value="${company.id}">${company.name}</option>`
          )
          .join("");

      // Get unique categories
      const categories = [
        ...new Set(companies.map((company) => company.category)),
      ];

      // Populate category select
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML =
        '<option value="">Select Category</option>' +
        categories
          .map(
            (category) =>
              `<option value="${category.toLowerCase()}">${category}</option>`
          )
          .join("");
    } catch (error) {
      showNotification("Failed to load companies", "error");
    }
  }

  async function loadInternships() {
    try {
      const result = await DashboardApiService.getInternships();

      console.log("Internships Result:", result);
      if (result.success) {
        showNotification("✅ Internships loaded successfully", "success");
        dom.internshipsBody.innerHTML = result.data.data
          .map(
            (internship) => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">${internship.title}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img src="${
                  internship.company.logo
                }" class="h-10 w-10 rounded-full">
                <div class="ml-4">${internship.company}</div>
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
      showNotification(" ❌ Failed to load internships", "error");
    }
  }

  async function loadAddCompanyFeature() {
    // Open modal
    dom.buttons.openAddCompany.addEventListener("click", (e) => {
      e.preventDefault();
      dom.modal.addCompany.classList.remove("hidden");
      dom.modal.addCompany.classList.add("flex");
    });

    // Close modal
    dom.buttons.closeAddCompany.addEventListener("click", () => {
      dom.modal.addCompany.classList.add("hidden");
      dom.modal.addCompany.classList.remove("flex");
    });

    // Handle form submission
    dom.form.addCompany.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("companyName").value.trim(),
        category: document.getElementById("companyCategory").value.trim(),
        logoUrl: document.getElementById("companyLogo").value.trim(),
        location: document.getElementById("companyLocation").value.trim(),
        about: document.getElementById("companyAbout").value.trim(),
      };

      console.log("Company data being sent before api:", data);

      const internships = document.getElementById("companyInternships").value;
      const rating = document.getElementById("companyRating").value;

      if (internships) data.currentNumberOfInternships = parseInt(internships);
      if (rating) data.rating = parseFloat(rating);

      try {
        const result = await DashboardApiService.createCompany(data);
        console.log("The Result is ", result.data);
        console.log("The Result is ", result.message);
        if (result.data) {
          showNotification("✅" + result.message, "success");
          dom.form.addCompany.reset();
          dom.modal.addCompany.classList.add("hidden");
          dom.modal.addCompany.classList.remove("flex");
        } else {
          throw new Error(result.message || "Unknown error");
        }
      } catch (error) {
        showNotification(`❌ Failed to add company: ${error.message}`, "error");
      }
    });
  }

  async function setupEventListeners() {
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
    dom.form.internship.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(dom.form.internship);

      // Get the company ID from the form data
      const companyId = formData.get("company");

      // Find the company name based on the selected company_id
      const company = companies.find(
        (company) => company.id === parseInt(companyId)
      );

      const internshipData = {
        title: formData.get("title"),
        company_id: formData.get("company"),
        company: company ? company.name : "",
        type: formData.get("type"),
        location: formData.get("location"),
        category: formData.get("category"),
        description: formData.get("description"),
        requirements: formData.get("requirements"),
        benefits: formData.get("benefits"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        salary_range: formData.get("salary"),
        deadline: formData.get("application_deadline"),
        link: formData.get("application_link"),
      };

      console.log("Internship data being sent:", internshipData);

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
        showNotification("✅ Internship deleted successfully!", "success");
        await loadStats();
        await loadInternships();
      }
    } catch (error) {
      showNotification("❌ Failed to delete internship", "error");
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
});
