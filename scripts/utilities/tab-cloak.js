// Tab Cloaking Script
// This script handles tab cloaking functionality across all pages

// Apply saved cloak on page load
function applySavedCloak() {
    const savedTitle = localStorage.getItem('cloakedTitle');
    const savedFavicon = localStorage.getItem('cloakedFavicon');
    
    if (savedTitle && savedFavicon) {
        console.log('Applying saved tab cloak:', savedTitle);
        document.title = savedTitle;
        
        // Update favicon
        const faviconElement = document.getElementById('favicon') || document.querySelector('link[rel="icon"]');
        if (faviconElement) {
            faviconElement.href = savedFavicon;
        } else {
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = savedFavicon;
            newFavicon.id = 'favicon';
            document.head.appendChild(newFavicon);
        }
    }
}

// Function to cloak the tab
function cloakTab(title, favicon) {
    console.log('Cloaking tab with:', title, favicon);
    
    // Change page title
    document.title = title || 'Google';
    
    // Change favicon
    const faviconElement = document.getElementById('favicon') || document.querySelector('link[rel="icon"]');
    if (faviconElement) {
        faviconElement.href = favicon || 'https://www.google.com/favicon.ico';
    } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = favicon || 'https://www.google.com/favicon.ico';
        newFavicon.id = 'favicon';
        document.head.appendChild(newFavicon);
    }
    
    // Store the cloak settings in localStorage for persistence
    localStorage.setItem('cloakedTitle', title);
    localStorage.setItem('cloakedFavicon', favicon);
    
    // Show a temporary confirmation if not in settings page
    if (!window.location.href.includes('/s.html')) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.textContent = `Tab cloaked as "${title}"`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 2000);
    }
}

// Apply saved cloak when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    applySavedCloak();
});

// Also try to apply immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applySavedCloak();
}

// Make cloakTab function globally available
window.cloakTab = cloakTab; 