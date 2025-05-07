
// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    
    // Toggle chatbot window
    chatbotButton.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
    });
    
    // Close chatbot window
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
});

// Handle chat input
function handleChatInput(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

// Send message function
function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response after a delay
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = generateBotResponse(message);
            addMessage(botResponse.text, 'bot', botResponse.quickReplies);
        }, 1000 + Math.random() * 2000);
    }
}
 // Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.bg-indigo-600');
    const searchInput = document.getElementById('search');

    searchButton[1].addEventListener('click', async function() {
        const query = searchInput.value.trim();
        console.log(query,"=====")
        
        if (!query) {
            alert('Please enter a search query');
            return;
        }

        const searchData = {
            query: query,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(searchData)
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
        }
    })
});
// Quick reply function
function sendQuickReply(element) {
    const message = element.textContent;
    const messagesContainer = document.getElementById('chatbotMessages');
    
    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response after a delay
    setTimeout(() => {
        removeTypingIndicator();
        const botResponse = generateBotResponse(message);
        addMessage(botResponse.text, 'bot', botResponse.quickReplies);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000 + Math.random() * 2000);
}

// Add message to chat
function addMessage(text, sender, quickReplies = null) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    messageDiv.appendChild(messageText);
    
    if (quickReplies) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies mt-2';
        
        quickReplies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'quick-reply';
            replyDiv.textContent = reply;
            replyDiv.onclick = function() { sendQuickReply(this); };
            quickRepliesDiv.appendChild(replyDiv);
        });
        
        messageDiv.appendChild(quickRepliesDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
    }
    
    messagesContainer.appendChild(typingDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate bot response based on user input
function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = {};
    
    if (lowerMessage.includes('internship') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
        response.text = "I can help you find great internships! What field are you interested in? You can browse by category or use the search bar at the top of the page.";
        response.quickReplies = ["Software Engineering", "Marketing", "Finance", "Data Science"];
    } 
    else if (lowerMessage.includes('application') || lowerMessage.includes('apply') || lowerMessage.includes('tip')) {
        response.text = "Here are some application tips:\n1. Tailor your resume for each position\n2. Write a compelling cover letter\n3. Highlight relevant projects and coursework\n4. Follow up after applying\nWould you like more details on any of these?";
        response.quickReplies = ["Resume tips", "Cover letter help", "Interview prep", "Follow-up advice"];
    }
    else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
        response.text = "For your resume:\n- Keep it to one page\n- Use action verbs\n- Quantify achievements\n- Include relevant coursework\nWe have a resume builder tool you can use. Would you like me to direct you there?";
        response.quickReplies = ["Yes, show resume builder", "No thanks", "Cover letter tips", "Examples"];
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response.text = "Hello! 😊 How can I assist you with your internship search today?";
        response.quickReplies = ["Find internships", "Application tips", "Resume help", "Interview prep"];
    }
    else {
        response.text = "I'm here to help with your internship search! You can ask me about finding internships, application tips, resume advice, or interview preparation. What would you like to know?";
        response.quickReplies = ["Find internships", "Application tips", "Resume help", "Interview prep"];
    }
    
    return response;
}

// Simple script to handle mobile menu toggle (can be expanded)
const mobileMenuButton = document.querySelector('.sm\\:hidden button');
const mobileMenu = document.querySelector('.sm\\:hidden + div');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
        // This would toggle a mobile menu if implemented
        console.log('Mobile menu clicked');
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
        e.target.reset();
    });
}
// serch engine
document.getElementById("search").addEventListener("input", () => {
    const searchInput = document.getElementById('search');
    const searchCard = document.getElementsByClassName('search-card');
    const query = searchInput.value.trim().toLowerCase();

    const textForSearch = document.getElementsByClassName("text-search");

    for (let i = 0; i < textForSearch.length; i++) {
        const text = textForSearch[i].textContent.toLowerCase();

        if (!query || text.includes(query)) {
            searchCard[i].style.display = '';
        } else {
            searchCard[i].style.display = 'none';
        }
    }
});

