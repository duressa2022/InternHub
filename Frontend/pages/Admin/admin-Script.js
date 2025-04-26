const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

toggleSidebar.addEventListener("click", function () {
  sidebar.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("sidebar-expanded");
  mainContent.classList.toggle("content-collapsed");
  mainContent.classList.toggle("content-expanded");
});

document.addEventListener("DOMContentLoaded", () => {
  let mockData = {
    stats: {
      totalInternships: 1000,
      activeCompanies: 324,
      registeredStudents: 8742,
      pendingApprovals: 18,
    },
    companies: [
      { id: 1, name: "ETechStar IT Solutions PLC" },
      { id: 2, name: "IE Networks" },
      { id: 3, name: "INSA" },
      { id: 4, name: "Backos P.L.C" },
      { id: 5, name: "ASTU ICT Center" },
      { id: 6, name: "CNET" },
      { id: 7, name: "Ashewa Technology Solutions" },
    ],
    internships: [
      {
        id: 1,
        title: "Software Engineer Intern",
        companyId: 2,
        type: "full-time",
        location: "Addis Ababa, Ethiopia",
        status: "published",
        logo: "../../assets/Logos/IE.png",
      },
      {
        id: 2,
        title: "Frontend Intern",
        companyId: 3,
        type: "part-time",
        location: "Remote",
        status: "pending",
        logo: "../../assets/Logos/INSA.png",
      },
    ],
  };

  // DOM Elements with null checks
  const dom = {
    stats: {
      totalInternships: document.getElementById("totalInternships"),
      activeCompanies: document.getElementById("activeCompanies"),
      registeredStudents: document.getElementById("registeredStudents"),
      pendingApprovals: document.getElementById("pendingApprovals"),
    },
    companySelect: document.getElementById("company"),
    internshipsBody: document.getElementById("internshipsBody"),
    sidebar: document.getElementById("sidebar"),
    mainContent: document.getElementById("mainContent"),
    notificationContainer: document.getElementById("notificationContainer") || {
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      innerHTML: "",
    },
    form: document.getElementById("internshipForm"),
  };

  init();

  function init() {
    loadStats();
    loadCompanies();
    loadInternships();
    setupEventListeners();
  }

  function loadStats() {
    dom.stats.totalInternships.textContent =
      mockData.stats.totalInternships.toLocaleString();
    dom.stats.activeCompanies.textContent =
      mockData.stats.activeCompanies.toLocaleString();
    dom.stats.registeredStudents.textContent =
      mockData.stats.registeredStudents.toLocaleString();
    dom.stats.pendingApprovals.textContent =
      mockData.stats.pendingApprovals.toLocaleString();
  }

  function loadCompanies() {
    dom.companySelect.innerHTML =
      '<option value="">Select Company</option>' +
      mockData.companies
        .map(
          (company) => `<option value="${company.id}">${company.name}</option>`
        )
        .join("");
  }

  function loadInternships() {
    dom.internshipsBody.innerHTML = mockData.internships
      .map((internship) => {
        const company = mockData.companies.find(
          (c) => c.id === internship.companyId
        );
        return `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">${internship.title}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img src="${internship.logo}" class="h-10 w-10 rounded-full">
                <div class="ml-4">${company?.name || "Unknown Company"}</div>
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
              <button class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
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
    dom.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(dom.form);

      const newInternship = {
        id: mockData.internships.length + 1,
        title: formData.get("title"),
        companyId: parseInt(formData.get("company")),
        type: formData.get("type"),
        location: formData.get("location"),
        status: formData.get("status"),
        logo: "https://via.placeholder.com/40",
      };

      mockData.internships.unshift(newInternship);
      mockData.stats.totalInternships++;

      if (newInternship.status === "pending") {
        mockData.stats.pendingApprovals++;
      }

      loadStats();
      loadInternships();
      showNotification("Internship published successfully!", "success");
      dom.form.reset();
    });
  }

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
