 
// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.querySelector('input[type="email"]')) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
                this.reset();
            }
        });
    });

    const resumButton = document.getElementById('resumeBtn')
    resumButton.addEventListener('click',()=>{
        const result = collectAndValidateFormData();
        console.log('it is esdasdasd')
        if (result) {
            console.log('it is ememed')
        }
    }) 


    async function collectAndValidateFormData() {
        const inputs = document.querySelectorAll('.resumeInput');
        const textareas = document.querySelectorAll('textarea');
        const formData = {};
    
        for (let input of inputs) {
            const key = input.name || input.placeholder.toLowerCase().replace(/\s+/g, '_');
            const value = input.value.trim();
    
            // Validation: required
            if (!value) {
                alert(`Please fill in the ${key.replace(/_/g, ' ')}`);
                input.focus();
                return null;
            }
    
            // Restrict name to letters only
            if (key === 'fullName' && /[^a-zA-Z\s]/.test(value)) {
                alert('Name should only contain letters and spaces.');
                input.focus();
                return null;
            }
    
            // Restrict phone to digits only
            if (key === 'phone' && /[^0-9]/.test(value)) {
                alert('Phone should only contain numbers.');
                input.focus();
                return null;
            }
    
            formData[key] = value;
        }
    
        for (let textarea of textareas) {
            const key = textarea.name || textarea.placeholder.toLowerCase().replace(/\s+/g, '_');
            const value = textarea.value.trim();
    
            if (!value) {
                alert(`Please fill in the ${key.replace(/_/g, ' ')}`);
                textarea.focus();
                return null;
            }
    
            formData[key] = value;
        }

        /**
         * @important correct the api url before test
         */
    
       /* try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Search response:', result);
            // TODO: Update UI with search results
        } catch (error) {
            console.error('Error sending search query:', error);
            alert('An error occurred while searching. Please try again.');
        }*/
    }
    
});