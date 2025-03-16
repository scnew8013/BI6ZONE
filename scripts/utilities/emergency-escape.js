// Emergency Escape Script
// This script adds emergency escape functionality to all pages of the website

// Global variables for emergency escape
let emergencyKeySequence = [];
let emergencyKeyListener = null;
let emergencyLastKeyTime = 0;
const EMERGENCY_KEY_TIMEOUT = 1500;

// Initialize emergency escape on page load
function initEmergencyEscape() {
    console.log('Initializing emergency escape...');
    
    // Check if escape settings are saved
    const savedSequence = localStorage.getItem('escapeKeySequence');
    const savedSite = localStorage.getItem('escapeSite');
    
    if (savedSequence && savedSite) {
        try {
            emergencyKeySequence = JSON.parse(savedSequence);
            setupEmergencyKeyListener(emergencyKeySequence, savedSite);
            console.log('Emergency escape initialized with saved settings');
        } catch (e) {
            console.error('Error parsing saved emergency key sequence', e);
        }
    } else {
        // Set default escape key sequence and site if not defined
        const defaultSequence = [
            { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false },
            { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false },
            { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }
        ];
        const defaultSite = 'https://google.com';
        
        localStorage.setItem('escapeKeySequence', JSON.stringify(defaultSequence));
        localStorage.setItem('escapeSite', defaultSite);
        
        emergencyKeySequence = defaultSequence;
        setupEmergencyKeyListener(defaultSequence, defaultSite);
        console.log('Emergency escape initialized with default settings (3x Escape key to Google)');
    }
}

// Setup emergency key listener
function setupEmergencyKeyListener(sequence, site) {
    // Remove any existing listener
    if (emergencyKeyListener) {
        window.removeEventListener('keydown', emergencyKeyListener);
    }

    let currentPosition = 0;
    
    emergencyKeyListener = function(e) {
        const now = Date.now();
        
        // Reset sequence if timeout exceeded
        if (currentPosition > 0 && now - emergencyLastKeyTime > EMERGENCY_KEY_TIMEOUT) {
            currentPosition = 0;
        }
        
        emergencyLastKeyTime = now;
        
        const expectedKey = sequence[currentPosition];
        
        const keyMatches = e.key === expectedKey.key;
        const modifiersMatch = 
            e.ctrlKey === expectedKey.ctrlKey && 
            e.altKey === expectedKey.altKey && 
            e.shiftKey === expectedKey.shiftKey && 
            e.metaKey === expectedKey.metaKey;
        
        if (keyMatches && modifiersMatch) {
            currentPosition++;
            
            if (currentPosition >= sequence.length) {
                window.location.href = site;
                currentPosition = 0;
            }
        } else {
            currentPosition = 0;
        }
    };
    
    window.addEventListener('keydown', emergencyKeyListener);
}

// Update emergency escape settings
function updateEmergencyEscape(sequence, site) {
    localStorage.setItem('escapeKeySequence', JSON.stringify(sequence));
    localStorage.setItem('escapeSite', site);
    
    emergencyKeySequence = sequence;
    setupEmergencyKeyListener(sequence, site);
    
    console.log('Emergency escape updated with new settings');
}

// Make functions globally available
window.updateEmergencyEscape = updateEmergencyEscape;

// Initialize emergency escape when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEmergencyEscape();
});

// Also try to initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initEmergencyEscape();
} 