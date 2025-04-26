 // Alphabet filter functionality
 document.addEventListener('DOMContentLoaded', function() {
    const alphabetItems = document.querySelectorAll('.alphabet-filter li');
    
    alphabetItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            alphabetItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically filter companies based on the selected letter
            console.log('Filtering companies by:', this.textContent);
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
            e.target.reset();
        });
    }
});