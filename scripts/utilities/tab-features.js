/**
 * Tab Features Utility Script
 * Handles tab cloaking and anti-close protection functionality
 */

// Tab Cloaking Functions
const tabCloak = {
    // Apply saved cloak on page load
    applySavedCloak: function() {
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
    },
    
    // Function to cloak the tab
    cloakTab: function(title, favicon) {
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
            this.showNotification(`Tab cloaked as "${title}"`);
        }
    },
    
    // Show notification
    showNotification: function(message, bgColor = 'rgba(40, 167, 69, 0.9)') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = bgColor;
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.textContent = message;
        
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
};

// Anti-Close Protection Functions
const antiClose = {
    // Variables
    enabled: false,
    handlerAdded: false,
    interval: null,
    fakeForm: null,
    dirtyInput: null,
    message: 'Are you sure you want to leave this page?',
    
    // Initialize anti-close protection
    init: function() {
        // Check both localStorage and sessionStorage
        const lsEnabled = localStorage.getItem('antiCloseEnabled');
        const ssEnabled = sessionStorage.getItem('antiCloseEnabled');
        
        // Determine if anti-close should be enabled
        this.enabled = lsEnabled === 'true' || ssEnabled === 'true';
        
        console.log('Initializing anti-close protection, enabled:', this.enabled);
        
        if (this.enabled) {
            this.apply();
        }
        
        // Set up continuous checking
        this.interval = setInterval(() => this.check(), 2000);
    },
    
    // Apply anti-close protection
    apply: function() {
        console.log('Applying anti-close protection...');
        
        // Set global variable
        this.enabled = true;
        
        // Save to storage so it persists across pages
        localStorage.setItem('antiCloseEnabled', 'true');
        sessionStorage.setItem('antiCloseEnabled', 'true');
        
        // Create a beforeunload handler - most reliable method
        window.addEventListener('beforeunload', function(e) {
            if (antiClose.enabled) {
                e.preventDefault();
                e.returnValue = antiClose.message;
                return antiClose.message;
            }
        });
        
        // Set dirty form method - works in some browsers
        this.createDirtyForm();
        
        // Mark as added
        this.handlerAdded = true;
        
        // Show notification
        tabCloak.showNotification('🔒 Anti-Close Protection Applied', 'rgba(40, 167, 69, 0.7)');
    },
    
    // Remove anti-close protection
    remove: function() {
        console.log('Removing anti-close protection');
        
        // Set global variable
        this.enabled = false;
        
        // Save to storage
        localStorage.setItem('antiCloseEnabled', 'false');
        sessionStorage.setItem('antiCloseEnabled', 'false');
        
        // Remove dirty form
        if (this.fakeForm && this.fakeForm.parentNode) {
            this.fakeForm.parentNode.removeChild(this.fakeForm);
            this.fakeForm = null;
        }
        
        // Reset handler flag (can't easily remove the event listener)
        this.handlerAdded = false;
        
        // Show notification
        tabCloak.showNotification('🔓 Anti-Close Protection Disabled', 'rgba(220, 53, 69, 0.7)');
    },
    
    // Create a dirty form to prevent closing
    createDirtyForm: function() {
        // Remove existing form if any
        if (this.fakeForm && this.fakeForm.parentNode) {
            this.fakeForm.parentNode.removeChild(this.fakeForm);
        }
        
        // Create a form
        this.fakeForm = document.createElement('form');
        this.fakeForm.id = 'anti-close-form';
        this.fakeForm.style.position = 'fixed';
        this.fakeForm.style.left = '-9999px';
        
        // Create an input
        this.dirtyInput = document.createElement('input');
        this.dirtyInput.type = 'text';
        this.dirtyInput.name = 'anti-close-input';
        this.dirtyInput.defaultValue = 'default';
        this.dirtyInput.value = 'changed-' + new Date().getTime(); // Make it "dirty"
        
        this.fakeForm.appendChild(this.dirtyInput);
        document.body.appendChild(this.fakeForm);
        
        // Keep the form "dirty" by updating it regularly
        setInterval(() => {
            if (this.dirtyInput) {
                this.dirtyInput.value = 'changed-' + new Date().getTime();
            }
        }, 1000);
        
        console.log('Created dirty form for anti-close protection');
    },
    
    // Check and apply anti-close if needed
    check: function() {
        // Check both localStorage and sessionStorage
        const lsEnabled = localStorage.getItem('antiCloseEnabled');
        const ssEnabled = sessionStorage.getItem('antiCloseEnabled');
        
        // Determine current setting
        const shouldBeEnabled = lsEnabled === 'true' || ssEnabled === 'true';
        
        // Apply or remove as needed
        if (shouldBeEnabled && !this.enabled) {
            console.log('Anti-close should be enabled but isn\'t, applying now');
            this.apply();
        } else if (!shouldBeEnabled && this.enabled) {
            console.log('Anti-close should be disabled but isn\'t, removing now');
            this.remove();
        }
    },
    
    // Toggle anti-close (to be called from settings page)
    toggle: function(enable) {
        console.log('Toggling anti-close:', enable);
        
        if (enable) {
            this.apply();
        } else {
            this.remove();
        }
    }
};

// Initialize features when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Apply tab cloak
    tabCloak.applySavedCloak();
    
    // Initialize anti-close protection
    antiClose.init();
});

// Also try to apply immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tabCloak.applySavedCloak();
    antiClose.init();
}

// Export the objects for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tabCloak, antiClose };
} else {
    // Make globally available in browser
    window.tabCloak = tabCloak;
    window.antiClose = antiClose;
} 