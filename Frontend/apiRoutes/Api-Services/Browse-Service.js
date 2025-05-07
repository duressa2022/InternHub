// Am using mock data here this will be replaced by data come from backend api
const internships = [
    {
        id: 1,
        title: "Software Engineering Intern",
        company: "Google",
        logo: "https://logo.clearbit.com/google.com",
        description: "Join Google's engineering team for a 12-week internship. Work on real projects, learn from experts, and contribute to products used by billions worldwide.",
        location: "United States, CA or Remote",
        jobType: "Contract",
        isPaid: true,
        workMode: "Remote",
        postedDays: 2,
        industry: "Technology",
        salary: 45,
        experienceLevel: "Intermediate"
    },
    {
        id: 2,
        title: "Product Design Intern",
        company: "Meta",
        logo: "https://logo.clearbit.com/facebook.com",
        description: "Work with Meta's design team to create intuitive, beautiful user experiences. This internship offers mentorship and hands-on experience with real products.",
        location: "Menlo Park, CA",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 7,
        industry: "Technology",
        salary: 40,
        experienceLevel: "Intermediate"
    },
    {
        id: 3,
        title: "Data Science Intern",
        company: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        description: "Analyze large datasets to derive insights that drive business decisions at Amazon. This internship provides exposure to machine learning and big data technologies.",
        location: "Seattle, WA",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 3,
        industry: "Technology",
        salary: 50,
        experienceLevel: "Advanced"
    },
    {
        id: 4,
        title: "Cloud Solutions Intern",
        company: "Microsoft",
        logo: "https://logo.clearbit.com/microsoft.com",
        description: "Work with Azure cloud technologies and help customers implement cloud solutions. Gain experience with enterprise cloud architecture and deployment.",
        location: "Redmond, WA or Remote",
        jobType: "Full-time",
        isPaid: true,
        workMode: "Remote",
        postedDays: 5,
        industry: "Technology",
        salary: 48,
        experienceLevel: "Intermediate"
    },
    {
        id: 5,
        title: "iOS Development Intern",
        company: "Apple",
        logo: "https://logo.clearbit.com/apple.com",
        description: "Join Apple's iOS team to work on the next generation of iPhone and iPad apps. Learn SwiftUI and contribute to apps used by millions worldwide.",
        location: "Cupertino, CA",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 1,
        industry: "Technology",
        salary: 55,
        experienceLevel: "Intermediate"
    },
    {
        id: 6,
        title: "Content Marketing Intern",
        company: "Netflix",
        logo: "https://logo.clearbit.com/netflix.com",
        description: "Help create engaging content that promotes Netflix shows and movies. Work with social media, blogs, and email campaigns to reach global audiences.",
        location: "Los Gatos, CA or Remote",
        jobType: "Part-time",
        isPaid: true,
        workMode: "Remote",
        postedDays: 14,
        industry: "Marketing",
        salary: 35,
        experienceLevel: "Entry Level"
    },
    {
        id: 7,
        title: "Financial Analyst Intern",
        company: "JPMorgan Chase",
        logo: "https://logo.clearbit.com/jpmorganchase.com",
        description: "Gain hands-on experience in financial analysis, forecasting, and reporting. Work with experienced analysts on real-world financial challenges.",
        location: "New York, NY",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 4,
        industry: "Finance",
        salary: 0,
        experienceLevel: "Intermediate"
    },
    {
        id: 8,
        title: "UX Research Intern",
        company: "Airbnb",
        logo: "https://logo.clearbit.com/airbnb.com",
        description: "Conduct user research to inform product decisions. Learn how to design and execute studies, analyze data, and present findings to stakeholders.",
        location: "San Francisco, CA",
        jobType: "Part-time",
        isPaid: true,
        workMode: "Hybrid",
        postedDays: 6,
        industry: "Technology",
        salary: 38,
        experienceLevel: "Entry Level"
    },
    {
        id: 9,
        title: "Machine Learning Intern",
        company: "Tesla",
        logo: "https://logo.clearbit.com/tesla.com",
        description: "Work on cutting-edge machine learning models for autonomous driving. Apply computer vision and deep learning techniques to solve real-world problems.",
        location: "Germany Palo Alto, CA",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 8,
        industry: "Engineering",
        salary: 60,
        experienceLevel: "Advanced"
    },
    {
        id: 10,
        title: "Healthcare Data Intern",
        company: "Johnson & Johnson",
        logo: "https://logo.clearbit.com/jnj.com",
        description: "Analyze healthcare data to improve patient outcomes. Work with medical professionals to implement data-driven solutions in healthcare settings.",
        location: "New Brunswick, NJ",
        jobType: "Full-time",
        isPaid: true,
        workMode: "On-site",
        postedDays: 10,
        industry: "Healthcare",
        salary: 45,
        experienceLevel: "Intermediate"
    },
    {
        id: 11,
        title: "Education Technology Intern",
        company: "Coursera",
        logo: "https://logo.clearbit.com/coursera.org",
        description: "Help develop innovative educational technology solutions. Work on improving the learning experience for millions of students worldwide.",
        location: "Mountain View, CA",
        jobType: "Part-time",
        isPaid: true,
        workMode: "Remote",
        postedDays: 9,
        industry: "Education",
        salary: 32,
        experienceLevel: "Entry Level"
    },
    {
        id: 12,
        title: "Blockchain Development Intern",
        company: "Coinbase",
        logo: "https://logo.clearbit.com/coinbase.com",
        description: "Work on cutting-edge blockchain technology. Develop and test smart contracts, decentralized applications, and cryptocurrency solutions.",
        location: "Remote",
        jobType: "Full-time",
        isPaid: true,
        workMode: "Remote",
        postedDays: 3,
        industry: "Technology",
        salary: 52,
        experienceLevel: "Advanced"
    }
];

/**
 * Fetch all internships
 * @returns {Promise<Array>} Promise that resolves to array of internships
 */
export async function fetchInternships() {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...internships]);
        }, 300);
    });
}

/**
 * Fetch internships with filters applied
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Promise that resolves to filtered internships
 */
export async function fetchFilteredInternships(filters) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredResults = filterInternships(filters);
            resolve(filteredResults);
        }, 300);
    });
}

/**
 * Fetch internships for a specific page
 * @param {number} page - Page number
 * @param {number} itemsPerPage - Items per page
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} Promise that resolves to paginated internships
 */
export async function fetchPaginatedInternships(page, itemsPerPage, filters = {}) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredResults = filterInternships(filters);
            const totalItems = filteredResults.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            const paginatedItems = filteredResults.slice(startIndex, endIndex);
            
            resolve({
                internships: paginatedItems,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage,
                    startIndex: startIndex + 1,
                    endIndex
                }
            });
        }, 300);
    });
}

/**
 * Submit newsletter subscription
 * @param {string} email - Email address
 * @returns {Promise<Object>} Promise that resolves to subscription result
 */
export async function submitNewsletterSubscription(email) {
    // Simulate API delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                resolve({ success: true, message: 'Thank you for subscribing!' });
            } else {
                reject({ success: false, message: 'Please enter a valid email address.' });
            }
        }, 500);
    });
}

/**
 * Apply for an internship
 * @param {number} internshipId - Internship ID
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} Promise that resolves to application result
 */
export async function applyForInternship(internshipId, applicationData) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Your application has been submitted successfully!',
                applicationId: Math.floor(Math.random() * 10000) + 1
            });
        }, 800);
    });
}

/**
 * Save internship to bookmarks
 * @param {number} internshipId - Internship ID
 * @param {boolean} isBookmarked - Whether to bookmark or unbookmark
 * @returns {Promise<Object>} Promise that resolves to bookmark result
 */
export async function toggleBookmark(internshipId, isBookmarked) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                isBookmarked,
                message: isBookmarked ? 'Internship saved to bookmarks' : 'Internship removed from bookmarks'
            });
        }, 300);
    });
}

// Helper function to filter internships based on criteria
function filterInternships(filters) {
    const {
        searchTerm = '',
        jobTypes = [],
        locations = [],
        industries = [],
        experienceLevels = [],
        minSalary = 0,
        maxSalary = 100,
        sortBy = 'relevant'
    } = filters;

    let results = [...internships];

    // Apply search filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(internship => 
            internship.title.toLowerCase().includes(term) ||
            internship.company.toLowerCase().includes(term) ||
            internship.description.toLowerCase().includes(term) ||
            internship.location.toLowerCase().includes(term) ||
            internship.industry.toLowerCase().includes(term)
        );
    }

    // Apply job type filter
    if (jobTypes.length > 0) {
        results = results.filter(internship => jobTypes.includes(internship.jobType));
    }

    // Apply location filter
    if (locations.length > 0) {
        results = results.filter(internship => {
            const internshipLocation = internship.location.toLowerCase();
            return locations.some(location => 
                internshipLocation.includes(location.toLowerCase())
            );
        });
    }

    // Apply industry filter
    if (industries.length > 0) {
        results = results.filter(internship => industries.includes(internship.industry));
    }

    // Apply experience level filter
    if (experienceLevels.length > 0) {
        results = results.filter(internship => experienceLevels.includes(internship.experienceLevel));
    }

    // Apply salary filter
    results = results.filter(internship => 
        internship.salary >= minSalary && internship.salary <= maxSalary
    );

    // Apply sorting
    switch(sortBy) {
        case 'newest':
            results.sort((a, b) => a.postedDays - b.postedDays);
            break;
        case 'salary':
            results.sort((a, b) => b.salary - a.salary);
            break;
        case 'deadline':
            // For this demo, we'll just sort by posted days as a proxy for deadline
            results.sort((a, b) => a.postedDays - b.postedDays);
            break;
        default: // 'relevant' or any other value
            // No specific sorting for "relevant" in this demo
            break;
    }

    return results;
}

// Utility function to validate email format
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}