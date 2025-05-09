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
      await loaduser();
      await loadInternships();
      await loadAddCompanyFeature();
      await setupEditButtons();
      await setupEventListeners();
    } catch (error) {
      showNotification(`Initialization failed: ${error.message}`, "error");
    }
  }

  async function loaduser() {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data"));
      if (!userData?.id) return;

      const user = await DashboardApiService.getUserById(userData.id);

      // Prepare data
      const fullName = `${user.first_name} ${user.last_name}`;
      const role = user.role || "Super Admin";
      const avatar =
        user.avater_url || "https://randomuser.me/api/portraits/women/47.jpg";

      // Atomic updates
      document
        .querySelectorAll(".user-name, .top-right-user-name")
        .forEach((el) => (el.textContent = fullName));
      document
        .querySelectorAll(".user-role")
        .forEach((el) => (el.textContent = role));
      document
        .querySelectorAll(".user-image, .top-right-user-image")
        .forEach((el) => (el.src = avatar));
    } catch (error) {
      console.error("User load failed:", error);
      // Optional: Set default values everywhere if API fails
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
              <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-btn" data-id="${
                internship.id
              }">Edit</button>
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
        console.log("The Result is ", result);
        // console.log("The Result is ", result.message);
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

        console.log("The Result is ", result);
        console.log("The Result is ", result.data);
        console.log("The Result is ", result.message);
        if (result.success) {
          showNotification("Internship created successfully!", "success");
          await loadStats();
          await loadInternships();
          // dom.form.reset();
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

  async function setupEditButtons() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await DashboardApiService.getInternshipById(id);
          const data = res.data;

          document.getElementById("editInternshipId").value = data.id;
          document.getElementById("editTitle").value = data.title;
          document.getElementById("editCompany").value = data.company;
          document.getElementById("editLocation").value = data.location;
          document.getElementById("editCategory").value = data.category;
          document.getElementById("editType").value = data.type;
          document.getElementById("editSalary").value = data.salary_range || "";
          document.getElementById("editStartDate").value = data.start_date;
          document.getElementById("editEndDate").value = data.end_date || "";
          document.getElementById("editDescription").value = data.description;
          document.getElementById("editRequirements").value = data.requirements;
          document.getElementById("editBenefits").value = data.benefits || "";
          document.getElementById("editDeadline").value = data.deadline || "";
          document.getElementById("editLink").value = data.link || "";

          document
            .getElementById("editInternshipModal")
            .classList.remove("hidden");
        } catch (err) {
          showNotification("❌ Failed to fetch internship details", "error");
        }
      });
    });

    // Close modal
    document.getElementById("closeEditModal").addEventListener("click", () => {
      document.getElementById("editInternshipModal").classList.add("hidden");
    });

    // Form submit
    document
      .getElementById("editInternshipForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("editInternshipId").value;

        const updatedData = {
          title: document.getElementById("editTitle").value,
          company: document.getElementById("editCompany").value,
          location: document.getElementById("editLocation").value,
          category: document.getElementById("editCategory").value,
          type: document.getElementById("editType").value,
          salary_range: document.getElementById("editSalary").value,
          start_date: document.getElementById("editStartDate").value,
          end_date: document.getElementById("editEndDate").value,
          description: document.getElementById("editDescription").value,
          requirements: document.getElementById("editRequirements").value,
          benefits: document.getElementById("editBenefits").value,
          deadline: document.getElementById("editDeadline").value,
          link: document.getElementById("editLink").value,
        };

        try {
          const res = await DashboardApiService.updateInternship(
            id,
            updatedData
          );
          if (res.message === "Internship updated successfully") {
            showNotification("✅ Internship updated", "success");
            document
              .getElementById("editInternshipModal")
              .classList.add("hidden");
            await loadInternships();
            setupEditButtons(); // Rebind
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          showNotification("❌ Update failed: " + error.message, "error");
        }
      });
  }

  // ======================
  // PROFILE MODAL FUNCTIONS
  // ======================

  // DOM Elements
  const profileTrigger = document.getElementById("profileTrigger");
  const profileModal = document.getElementById("profileModal");
  const closeProfileModalBtn = document.getElementById("closeProfileModal");
  const profileTabs = document.querySelectorAll(".profile-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  // Open Modal
  function openProfileModal() {
    profileModal.classList.remove("hidden");
    loadProfileData();
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  // Close Modal
  function closeProfileModal() {
    profileModal.classList.add("hidden");
    document.body.style.overflow = ""; // Re-enable scrolling
  }

  // Tab Switching
  function switchTab(tabName) {
    profileTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === `${tabName}Tab`);
    });
  }

  // ======================
  // EVENT LISTENERS
  // ======================

  // Profile Trigger
  profileTrigger.addEventListener("click", openProfileModal);

  // Close Modal
  closeProfileModalBtn.addEventListener("click", closeProfileModal);

  // Tab Click Handlers
  profileTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Close when clicking outside modal
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) closeProfileModal();
  });

  // ======================
  // PROFILE DATA FUNCTIONS
  // ======================

  async function loadProfileData() {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data"));
      const user = await DashboardApiService.getUserById(userData.id);

      // Set form values
      document.getElementById("userId").value = user.id;
      document.getElementById("firstName").value = user.first_name;
      document.getElementById("lastName").value = user.last_name;
      document.getElementById("email").value = user.email;
      document.getElementById("avatarUrl").value = user.avater_url || "";

      // Update modal image
      const modalImg = document.getElementById("modalProfileImage");
      modalImg.src =
        user.avater_url || "https://randomuser.me/api/portraits/women/44.jpg";

      // Update avatar preview on URL change
      document.getElementById("avatarUrl").addEventListener("input", (e) => {
        modalImg.src = e.target.value || modalImg.src;
      });
    } catch (error) {
      showNotification("Failed to load profile data", "error");
    }
  }

  // ======================
  // FORM HANDLERS
  // ======================

  // Profile Update Form
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        first_name: document.getElementById("firstName").value.trim(),
        last_name: document.getElementById("lastName").value.trim(),
        avater_url: document.getElementById("avatarUrl").value.trim(),
      };

      try {
        const userId = document.getElementById("userId").value;
        await DashboardApiService.updateUser(userId, formData);

        showNotification("Profile updated successfully", "success");
        closeProfileModal();
        loaduser();
      } catch (error) {
        showNotification(error.message || "Failed to update profile", "error");
      }
    });

  // Password Change Form
  document
    .getElementById("passwordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        showNotification("New passwords do not match", "error");
        return;
      }

      try {
        await DashboardApiService.resetPassword({
          old_password: currentPassword,
          new_password: newPassword,
        });

        showNotification("Password changed successfully", "success");
        document.getElementById("passwordForm").reset();
      } catch (error) {
        showNotification(error.message || "Failed to change password", "error");
      }
    });

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
