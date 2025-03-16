// Message System Script
// Handles displaying messages across the site

// Initialize the shown messages from localStorage or create empty object
let shownMessages = {};
try {
    const savedMessages = localStorage.getItem('bi66ie619_shown_messages');
    if (savedMessages) {
        shownMessages = JSON.parse(savedMessages);
    }
} catch (e) {
    console.error('Error loading shown messages from localStorage:', e);
    shownMessages = {};
}

// Function to save shown messages to localStorage
function saveShownMessages() {
    try {
        localStorage.setItem('unblockzone_shown_messages', JSON.stringify(shownMessages));
    } catch (e) {
        console.error('Error saving shown messages to localStorage:', e);
    }
}

// Show a message with custom text, where to show it, and if it should only be shown once
function showGlowingMessage(messageText, screenId = 'all', showOnce = true) {
    // If we should only show once and it's already been shown, don't show it again
    const messageKey = screenId + '-' + messageText;
    if (showOnce && shownMessages[messageKey]) {
        return;
    }
    
    // Mark as shown if needed
    if (showOnce) {
        shownMessages[messageKey] = true;
        saveShownMessages(); // Save to localStorage
    }
    
    // Check if we're on the right screen
    if (screenId !== 'all') {
        // Get current page name from URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (screenId !== currentPage && screenId !== currentPage.replace('.html', '')) {
            return;
        }
    }
    
    // Remove any existing message
    removeGlowingMessage();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'message-overlay';
    overlay.className = 'message-overlay';
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.id = 'glowing-message';
    messageContainer.className = 'glowing-message';
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'message-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = removeGlowingMessage;
    
    // Create message text
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = messageText;
    
    // Assemble message
    messageContainer.appendChild(closeButton);
    messageContainer.appendChild(messageContent);
    
    // Add overlay and message to body
    overlay.appendChild(messageContainer);
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
        overlay.style.opacity = '1';
        messageContainer.style.transform = 'scale(1)';
    }, 10);
}

// Remove the message
function removeGlowingMessage() {
    const existingOverlay = document.getElementById('message-overlay');
    if (existingOverlay) {
        existingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            if (existingOverlay.parentNode) {
                existingOverlay.parentNode.removeChild(existingOverlay);
            }
        }, 300);
    }
}

// Add function to reset all shown messages (for testing)
function resetShownMessages() {
    shownMessages = {};
    saveShownMessages();
    console.log('All message history has been reset');
}

// Add CSS to the page
function addMessageStyles() {
    // Check if styles are already added
    if (document.getElementById('message-system-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'message-system-styles';
    style.textContent = `
        .message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .glowing-message {
            position: relative;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 25px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            width: 400px;
            max-width: 80%;
            opacity: 1;
            border: 1px solid rgba(255, 255, 255, 0.3);
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .message-close {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 25px;
            height: 25px;
            background: black;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
            border: 1px solid white;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .message-close:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(255, 255, 255, 1);
        }
        
        .message-content {
            width: 100%;
            line-height: 1.4;
            font-size: 16px;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    addMessageStyles();
});

// Try to initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addMessageStyles();
}

// Make functions globally available
window.showGlowingMessage = showGlowingMessage;
window.removeGlowingMessage = removeGlowingMessage; 
