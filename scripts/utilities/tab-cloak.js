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
    } else {
        // If no cloak is set, apply current page name by default
        cloakTabWithCurrentPage('https://files.catbox.moe/ao6qv3.png');
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

// Function to cloak tab with current page name
function cloakTabWithCurrentPage(favicon) {
    // Get the current page name from URL
    let pageName = 'unblockzone';
    
    // Extract page name from URL
    const path = window.location.pathname;
    
    // Check for main pages and their subdirectories
    if (path.includes('/g.html') || path.includes('/g/')) {
        pageName = 'games';
    } else if (path.includes('/a.html') || path.includes('/a/')) {
        pageName = 'apps';
    } else if (path.includes('/m.html') || path.includes('/m/')) {
        pageName = 'movies';
    } else if (path.includes('/e.html') || path.includes('/e/')) {
        pageName = 'exploits';
    } else if (path.includes('/s.html')) {
        pageName = 'settings';
    } else if (path === '/' || path.includes('/index.html')) {
        pageName = 'home';
    } else if (path.includes('/es.html')) {
        pageName = 'games (español)';
    } else if (path.includes('/chat.html')) {
        pageName = 'chat';
    } else if (path.includes('/ai.html')) {
        pageName = 'ai tools';
    }
    
    console.log('Cloaking tab with current page name:', pageName);
    
    // Apply the cloak with current page name
    cloakTab(pageName, favicon || 'https://files.catbox.moe/ao6qv3.png');
}

// Apply saved cloak when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    applySavedCloak();
});

// Also try to apply immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applySavedCloak();
}

// Make functions globally available
window.cloakTab = cloakTab;
window.cloakTabWithCurrentPage = cloakTabWithCurrentPage; 
