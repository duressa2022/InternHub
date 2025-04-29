// Am using mock data here this will be replaced by data come from backend api
const additionalCompaniesData = [
    {
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      rating: 4.5,
      industry: "Technology",
      location: "Seattle, WA",
      description: "Amazon offers internships across various domains including software development, operations, and business, providing hands-on experience with innovative technologies.",
      openInternships: 15
    },
    {
      name: "Apple",
      logo: "https://logo.clearbit.com/apple.com",
      rating: 4.7,
      industry: "Technology",
      location: "Cupertino, CA",
      description: "Apple's internship program offers opportunities to work on groundbreaking products and technologies that impact millions of users worldwide.",
      openInternships: 11
    },
    {
      name: "Deloitte",
      logo: "https://logo.clearbit.com/deloitte.com",
      rating: 4.2,
      industry: "Consulting",
      location: "New York, NY",
      description: "Deloitte offers internships in consulting, audit, tax, and advisory services, providing students with valuable professional experience.",
      openInternships: 8
    },
    {
      name: "Facebook",
      logo: "https://logo.clearbit.com/facebook.com",
      rating: 4.6,
      industry: "Technology",
      location: "Menlo Park, CA",
      description: "Facebook's internship program allows students to work on real-world problems and make an impact on products used by billions of people.",
      openInternships: 9
    }
  ];
  
  // Fetch additional companies (simulating an API call)
  export async function fetchAdditionalCompanies() {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...additionalCompaniesData]);
      }, 300);
    });
  }
  
  // Fetch companies by filter criteria (simulating an API call)
  export async function fetchCompaniesByFilter(filters) {
    // In a real app, this would make an API call with the filters
    // For now, we'll just return the additional companies that match the filters
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is just a simulation - in a real app, filtering would happen on the server
        const { searchTerm, letter, industry, location, rating } = filters;
        
        let filteredCompanies = [...additionalCompaniesData];
        
        // Apply filters (this would normally happen on the backend)
        if (searchTerm) {
          filteredCompanies = filteredCompanies.filter(company => 
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (letter && letter !== 'All') {
          filteredCompanies = filteredCompanies.filter(company => 
            company.name.charAt(0).toUpperCase() === letter
          );
        }
        
        if (industry) {
          filteredCompanies = filteredCompanies.filter(company => 
            company.industry.includes(industry)
          );
        }
        
        if (location) {
          filteredCompanies = filteredCompanies.filter(company => 
            company.location.includes(location)
          );
        }
        
        if (rating) {
          const minRating = rating.includes('4+') ? 4 : rating.includes('3+') ? 3 : 0;
          filteredCompanies = filteredCompanies.filter(company => 
            company.rating >= minRating
          );
        }
        
        resolve(filteredCompanies);
      }, 300);
    });
  }
  
  // Submit newsletter subscription (simulating an API call)
  export async function submitNewsletterSubscription(email) {
    // Simulate network request
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
  
  // Validate email format (utility function)
  export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }