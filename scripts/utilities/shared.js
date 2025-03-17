// Global variables for emergency escape
let globalKeySequence = [];
let globalKeyListener = null;
let globalLastKeyTime = 0;
const KEY_TIMEOUT = 1500;

// Anti-close functionality
let antiCloseEnabled = false;
let antiCloseMessage = 'Are you sure you want to leave this page?';
let antiCloseHandlerAdded = false;
let antiCloseInterval = null;
let fakeForm = null;
let dirtyInput = null;

// Initialize anti-close protection immediately on script load
(function() {
    console.log('Initializing anti-close protection on page load');
    
    // Check both localStorage and sessionStorage
    const lsEnabled = localStorage.getItem('antiCloseEnabled');
    const ssEnabled = sessionStorage.getItem('antiCloseEnabled');
    
    // Determine if anti-close should be enabled (true string or boolean true)
    antiCloseEnabled = lsEnabled === 'true' || ssEnabled === 'true';
    
    console.log('Initial check: anti-close enabled:', antiCloseEnabled);
    
    if (antiCloseEnabled) {
        console.log('Anti-close is enabled, applying immediately');
        applyAntiCloseProtection();
    }
    
    // Set up continuous checking to ensure it stays applied
    setInterval(checkAndApplyAntiClose, 2000);
})();

// Apply anti-close protection using multiple methods
function applyAntiCloseProtection() {
    console.log('Applying anti-close protection to page...');
    
    // Set global variable
    antiCloseEnabled = true;
    
    // Save to storage so it persists across pages
    localStorage.setItem('antiCloseEnabled', 'true');
    sessionStorage.setItem('antiCloseEnabled', 'true');
    
    // Create a beforeunload handler - most reliable method
    window.addEventListener('beforeunload', function(e) {
        if (antiCloseEnabled) {
            e.preventDefault();
            e.returnValue = antiCloseMessage;
            return antiCloseMessage;
        }
    });
    
    // Set dirty form method - works in some browsers
    createDirtyForm();
    
    console.log('Anti-close protection applied with multiple methods');
    showAntiCloseIndicator('🔒 Anti-Close Protection Applied', 'rgba(40, 167, 69, 0.7)');
    
    // Mark as added
    antiCloseHandlerAdded = true;
}

// Remove anti-close protection
function removeAntiCloseProtection() {
    console.log('Removing anti-close protection');
    
    // Set global variable
    antiCloseEnabled = false;
    
    // Save to storage
    localStorage.setItem('antiCloseEnabled', 'false');
    sessionStorage.setItem('antiCloseEnabled', 'false');
    
    // Remove dirty form
    if (fakeForm && fakeForm.parentNode) {
        fakeForm.parentNode.removeChild(fakeForm);
        fakeForm = null;
    }
    
    // We can't easily remove event listeners, but we can set the flag to disable them
    antiCloseHandlerAdded = false;
    
    console.log('Anti-close protection removed');
    showAntiCloseIndicator('🔓 Anti-Close Protection Disabled', 'rgba(220, 53, 69, 0.7)');
}

// Create a dirty form to prevent closing
function createDirtyForm() {
    // Remove existing form if any
    if (fakeForm && fakeForm.parentNode) {
        fakeForm.parentNode.removeChild(fakeForm);
    }
    
    // Create a form
    fakeForm = document.createElement('form');
    fakeForm.id = 'anti-close-form';
    fakeForm.style.position = 'fixed';
    fakeForm.style.left = '-9999px';
    
    // Create an input
    dirtyInput = document.createElement('input');
    dirtyInput.type = 'text';
    dirtyInput.name = 'anti-close-input';
    dirtyInput.defaultValue = 'default';
    dirtyInput.value = 'changed-' + new Date().getTime(); // Make it "dirty"
    
    fakeForm.appendChild(dirtyInput);
    document.body.appendChild(fakeForm);
    
    // Keep the form "dirty" by updating it regularly
    setInterval(function() {
        if (dirtyInput) {
            dirtyInput.value = 'changed-' + new Date().getTime();
        }
    }, 1000);
    
    console.log('Created dirty form for anti-close protection');
}

// Check and apply anti-close if needed
function checkAndApplyAntiClose() {
    // Check both localStorage and sessionStorage
    const lsEnabled = localStorage.getItem('antiCloseEnabled');
    const ssEnabled = sessionStorage.getItem('antiCloseEnabled');
    
    // Determine current setting
    const shouldBeEnabled = lsEnabled === 'true' || ssEnabled === 'true';
    
    // Apply or remove as needed
    if (shouldBeEnabled && !antiCloseEnabled) {
        console.log('Anti-close should be enabled but isn\'t, applying now');
        applyAntiCloseProtection();
    } else if (!shouldBeEnabled && antiCloseEnabled) {
        console.log('Anti-close should be disabled but isn\'t, removing now');
        removeAntiCloseProtection();
    }
}

// Function to toggle anti-close (to be called from settings page)
function toggleAntiClose(enable) {
    console.log('Toggling anti-close:', enable);
    
    if (enable) {
        applyAntiCloseProtection();
    } else {
        removeAntiCloseProtection();
    }
}

// Function to show visual indicator
function showAntiCloseIndicator(text, bgColor = 'rgba(40, 167, 69, 0.7)') {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = bgColor;
    indicator.style.color = 'white';
    indicator.style.padding = '10px 15px';
    indicator.style.borderRadius = '5px';
    indicator.style.fontSize = '16px';
    indicator.style.fontWeight = 'bold';
    indicator.style.zIndex = '9999';
    indicator.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    indicator.textContent = text;
    document.body.appendChild(indicator);
    
    // Add fade-in animation
    indicator.style.opacity = '0';
    indicator.style.transition = 'opacity 0.5s';
    setTimeout(() => { indicator.style.opacity = '1'; }, 10);
    
    // Remove after 5 seconds
    setTimeout(function() {
        indicator.style.opacity = '0';
        setTimeout(function() {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }, 5000);
}

// Function to check and setup emergency escape on any page
function checkAndSetupEmergencyEscape() {
    const savedSequence = localStorage.getItem('escapeKeySequence');
    const savedSite = localStorage.getItem('escapeSite');
    
    if (savedSequence && savedSite) {
        try {
            globalKeySequence = JSON.parse(savedSequence);
            setupGlobalKeyListener(globalKeySequence, savedSite);
        } catch (e) {
            console.error('Error parsing saved key sequence', e);
        }
    }
}

// Global key listener setup
function setupGlobalKeyListener(sequence, site) {
    // Remove any existing listener
    if (globalKeyListener) {
        window.removeEventListener('keydown', globalKeyListener);
    }

    let currentPosition = 0;
    
    globalKeyListener = function(e) {
        const now = Date.now();
        
        // Reset sequence if timeout exceeded
        if (currentPosition > 0 && now - globalLastKeyTime > KEY_TIMEOUT) {
            currentPosition = 0;
        }
        
        globalLastKeyTime = now;
        
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
    
    window.addEventListener('keydown', globalKeyListener);
}

// Tab cloaking function
function cloakTab(newTitle, newUrl) {
    // Change the title
    document.title = newTitle;
    
    // Change the favicon (tab image)
    var favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.href = newUrl;
    }
    
    // Update the URL in the browser without reloading
    history.pushState({}, newTitle, newUrl);
}

// Silent error handling function (replacement for alerts)
function handleError(message) {
    // Use alert for error messages
    alert("Error: " + message);
}

// Function to add a home button to all pages
function addHomeButton() {
    console.log('Adding home button to page');
    
    // Check if we're already on the home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        console.log('On home page, not adding home button');
        return; // Don't add home button on the home page
    }
    
    // Check if the icons container already exists
    let iconsContainer = document.querySelector('.icons');
    
    // If icons container doesn't exist, create it
    if (!iconsContainer) {
        console.log('Icons container not found, creating one');
        iconsContainer = document.createElement('div');
        iconsContainer.className = 'icons';
        
        // Add styles if not already in the page
        const style = document.createElement('style');
        style.textContent = `
            .icons {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                justify-content: center;
            }
            .icon-container {
                width: 60px;
                height: 60px;
                background-color: black;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                box-shadow: 0 0 10px white;
            }
            .icon-container:hover {
                transform: scale(1.2);
                box-shadow: 0 0 20px white;
            }
            .icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                cursor: pointer;
            }
            .home-icon-container {
                background-color: #007bff;
                position: relative;
            }
            .home-icon-container::after {
                content: 'home';
                position: absolute;
                bottom: -20px;
                font-size: 12px;
                color: white;
            }
        `;
        document.head.appendChild(style);
        
        // Find where to insert the icons container
        const title = document.querySelector('.title');
        if (title && title.parentNode) {
            console.log('Found title, inserting icons container after it');
            title.parentNode.insertBefore(iconsContainer, title.nextSibling);
        } else {
            console.log('No title found, appending icons container to body');
            document.body.appendChild(iconsContainer);
        }
    } else {
        console.log('Found existing icons container');
    }
    
    // Check if home button already exists
    if (!document.querySelector('.home-icon-container')) {
        console.log('Home button not found, creating one');
        // Create home button
        const homeLink = document.createElement('a');
        homeLink.href = '/index.html';
        homeLink.className = 'icon-container home-icon-container';
        homeLink.onclick = function(event) {
            event.preventDefault();
            window.location.href = '/index.html';
        };
        
        // Create home icon
        const homeIcon = document.createElement('img');
        homeIcon.src = 'https://img.icons8.com/ios-filled/50/FFFFFF/home.png';
        homeIcon.alt = 'Home';
        homeIcon.className = 'icon';
        
        // Add home button to the beginning of the icons container
        homeLink.appendChild(homeIcon);
        iconsContainer.insertBefore(homeLink, iconsContainer.firstChild);
        
        console.log('Home button added successfully');
    } else {
        console.log('Home button already exists');
    }
}

// Call the function immediately to ensure it runs
(function() {
    console.log('Running immediate home button initialization');
    // Try to add the home button immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addHomeButton();
    }
    
    // Also add it when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM content loaded, adding home button');
        addHomeButton();
        
        // Also check anti-close settings and emergency escape
        checkAndSetupEmergencyEscape();
        checkAntiCloseSettings();
        
        // Add a visual indicator if anti-close is enabled
        const isEnabled = localStorage.getItem('antiCloseEnabled') === 'true' || 
                         sessionStorage.getItem('antiCloseEnabled') === 'true';
        
        if (isEnabled) {
            // Show notification with a slight delay to ensure it's visible
            setTimeout(function() {
                showAntiCloseIndicator('🔒 Anti-close Protection: ACTIVE');
            }, 1000);
        }
    });
})();

// Function to open the site in about:blank (if it exists in shared.js)
function openInAboutBlank() {
    const newWindow = window.open('about:blank', '_blank');
    
    if (newWindow) {
        // Get the current page's HTML
        const currentHTML = document.documentElement.outerHTML;
        
        // Get the base URL for relative paths - handle localhost specially
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = window.location.origin;
        
        // Write to the new window
        newWindow.document.open();
        newWindow.document.write(currentHTML);
        
        // Add script to fix navigation in about:blank
        const fixScript = document.createElement('script');
        fixScript.textContent = `
            // Store that we're in about:blank mode
            localStorage.setItem('inAboutBlank', 'true');
            
            // Add base URL for proper resource loading
            const baseElement = document.createElement('base');
            baseElement.href = "${baseUrl}/";
            document.head.prepend(baseElement);
            
            // Special handling for localhost
            const isLocalhost = ${isLocalhost};
            
            // Fix all navigation links immediately
            function fixAllLinks() {
                document.querySelectorAll('a').forEach(link => {
                    const originalHref = link.getAttribute('href');
                    if (originalHref && (originalHref.endsWith('.html') || originalHref.startsWith('/'))) {
                        // Store the original href as a data attribute
                        link.setAttribute('data-original-href', originalHref);
                        
                        // Create a new onclick handler that completely replaces the default behavior
                        link.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Get the target page
                            const targetPage = originalHref.startsWith('/') ? originalHref.substring(1) : originalHref;
                            
                            // Navigate while staying in about:blank
                            window.location.hash = '#' + targetPage;
                            loadPageInAboutBlank(targetPage);
                            
                            return false;
                        };
                    }
                });
            }
            
            // Function to load a page in about:blank
            function loadPageInAboutBlank(page) {
                console.log('Loading page in about:blank:', page);
                
                // Add the base URL if the page doesn't have it
                const fullUrl = page.startsWith('http') ? page : "${baseUrl}/" + page;
                
                // For localhost, we need to handle CORS issues
                if (isLocalhost) {
                    console.log('Localhost detected, using special handling for:', fullUrl);
                    
                    // Create a loading indicator
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.style.position = 'fixed';
                    loadingIndicator.style.top = '50%';
                    loadingIndicator.style.left = '50%';
                    loadingIndicator.style.transform = 'translate(-50%, -50%)';
                    loadingIndicator.style.padding = '20px';
                    loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    loadingIndicator.style.color = 'white';
                    loadingIndicator.style.borderRadius = '10px';
                    loadingIndicator.style.zIndex = '9999';
                    loadingIndicator.textContent = 'Loading...';
                    document.body.appendChild(loadingIndicator);
                }
                
                fetch(fullUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.status);
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Parse the HTML to get just the body content
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Replace the current body with the new body
                        document.body.innerHTML = doc.body.innerHTML;
                        document.title = doc.title;
                        
                        // Make sure the base element is still there
                        if (!document.querySelector('base')) {
                            const baseElement = document.createElement('base');
                            baseElement.href = "${baseUrl}/";
                            document.head.prepend(baseElement);
                        }
                        
                        // Fix links in the new content
                        setTimeout(fixAllLinks, 100);
                        
                        // Execute scripts in the new content
                        const scripts = Array.from(doc.querySelectorAll('script'));
                        scripts.forEach((script, index) => {
                            if (script.src) {
                                const newScript = document.createElement('script');
                                newScript.src = script.src;
                                newScript.onload = () => {
                                    console.log('Script loaded:', script.src);
                                };
                                newScript.onerror = (error) => {
                                    console.error('Error loading script:', script.src, error);
                                };
                                document.body.appendChild(newScript);
                            } else if (script.textContent) {
                                try {
                                    // Create a new script element to ensure it runs
                                    const newScript = document.createElement('script');
                                    newScript.textContent = script.textContent;
                                    document.body.appendChild(newScript);
                                } catch (error) {
                                    console.error('Error executing inline script:', error);
                                }
                            }
                        });
                        
                        // Re-initialize any event listeners or functionality
                        if (typeof checkAntiCloseSettings === 'function') {
                            checkAntiCloseSettings();
                        }
                        if (typeof checkAndSetupEmergencyEscape === 'function') {
                            checkAndSetupEmergencyEscape();
                        }
                        
                        // Add a visual indicator that we're in about:blank mode
                        const indicator = document.createElement('div');
                        indicator.style.position = 'fixed';
                        indicator.style.bottom = '10px';
                        indicator.style.right = '10px';
                        indicator.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
                        indicator.style.color = 'white';
                        indicator.style.padding = '5px 10px';
                        indicator.style.borderRadius = '5px';
                        indicator.style.fontSize = '12px';
                        indicator.style.zIndex = '9999';
                        indicator.textContent = 'About:Blank Mode';
                        document.body.appendChild(indicator);
                        
                        console.log('Page loaded successfully in about:blank');
                    })
                    .catch(error => {
                        console.error('Error loading page:', error);
                        
                        // Show error message to user
                        const errorDiv = document.createElement('div');
                        errorDiv.style.padding = '20px';
                        errorDiv.style.margin = '20px';
                        errorDiv.style.backgroundColor = '#ffeeee';
                        errorDiv.style.border = '1px solid #ff0000';
                        errorDiv.style.borderRadius = '5px';
                        
                        errorDiv.innerHTML = `
                            <h3>Error Loading Page</h3>
                            <p>${error.message}</p>
                            <p>This is likely due to running on localhost. For about:blank to work properly with navigation:</p>
                            <ul>
                                <li>Try accessing the site through a real domain</li>
                                <li>Or deploy to a web server with proper CORS headers</li>
                                <li>Or use a browser extension to disable CORS for local development</li>
                            </ul>
                        `;
                        
                        document.body.innerHTML = '';
                        document.body.appendChild(errorDiv);
                        
                        document.getElementById('goBackBtn').onclick = function() {
                            history.back();
                        };
                    })
                    .finally(() => {
                        // Remove loading indicator if it exists
                        const loadingIndicator = document.querySelector('[style*="Loading..."]');
                        if (loadingIndicator) {
                            loadingIndicator.remove();
                        }
                    });
            }
            
            // Run immediately when the page loads
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOM loaded in about:blank window');
                fixAllLinks();
                
                // Add a visual indicator that we're in about:blank mode
                const indicator = document.createElement('div');
                indicator.style.position = 'fixed';
                indicator.style.bottom = '10px';
                indicator.style.right = '10px';
                indicator.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
                indicator.style.color = 'white';
                indicator.style.padding = '5px 10px';
                indicator.style.borderRadius = '5px';
                indicator.style.fontSize = '12px';
                indicator.style.zIndex = '9999';
                indicator.textContent = 'About:Blank Mode';
                document.body.appendChild(indicator);
                
                // Check if we need to load a specific page from hash
                if (window.location.hash && window.location.hash.startsWith('#')) {
                    const page = window.location.hash.substring(1);
                    if (page && (page.endsWith('.html') || !page.includes('.'))) {
                        loadPageInAboutBlank(page);
                    }
                }
            });
            
            // Also run now in case DOMContentLoaded already fired
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                console.log('DOM already loaded, fixing links now');
                fixAllLinks();
            }
        `;
        newWindow.document.head.appendChild(fixScript);
        
        newWindow.document.close();
        
        // For localhost, show a message about limitations
        if (isLocalhost) {
            alert("About:blank mode has limitations on localhost. Navigation between pages may not work correctly due to browser security restrictions. For best results, deploy to a real web server.");
        }
    } else {
        alert('Pop-up blocked. Please allow pop-ups for this site to use this feature.');
    }
}

// Function to create a game template for all game pages
function createGameTemplate() {
    // Only run on game pages (in the /g/ directory)
    if (!window.location.pathname.includes('/g/')) {
        return;
    }
    
    // Check if the template has already been applied
    if (document.querySelector('.game-container-template')) {
        return;
    }
    
    // Get the game title
    const gameTitle = document.title.toLowerCase();
    
    // Find the game content - could be an iframe or other element
    let gameSource = '';
    let gameContent = null;
    
    // Check for iframe first
    const existingIframe = document.querySelector('iframe');
    if (existingIframe) {
        gameSource = existingIframe.src;
        gameContent = existingIframe;
    } else {
        // For Unity games or other content
        const unityContainer = document.querySelector('#unity-container');
        if (unityContainer) {
            gameContent = unityContainer;
        } else {
            // For HTML5 games
            const gameDiv = document.querySelector('#ga_game, #game, .webgl-content');
            if (gameDiv) {
                gameContent = gameDiv;
            }
        }
    }
    
    // If we couldn't find any game content, log an error and return
    if (!gameContent) {
        console.error('No game content found on this page');
        return;
    }
    
    // Save the original content
    const originalContent = gameContent.cloneNode(true);
    
    // Clear the body content
    document.body.innerHTML = '';
    
    // Set the background
    document.body.style.background = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROdNIejFmjeKC5u6Xq2yqOCa5y-uJseTCTfA&s') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.minHeight = "100vh";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.color = "white";
    
    // Create home button
    const homeButton = document.createElement('a');
    homeButton.href = '/g.html';
    homeButton.className = 'home-button';
    homeButton.style.position = "fixed";
    homeButton.style.top = "20px";
    homeButton.style.left = "20px";
    homeButton.style.backgroundColor = "#007bff";
    homeButton.style.color = "white";
    homeButton.style.border = "none";
    homeButton.style.borderRadius = "50%";
    homeButton.style.width = "50px";
    homeButton.style.height = "50px";
    homeButton.style.display = "flex";
    homeButton.style.alignItems = "center";
    homeButton.style.justifyContent = "center";
    homeButton.style.cursor = "pointer";
    homeButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
    homeButton.style.transition = "all 0.3s ease";
    homeButton.style.zIndex = "100";
    homeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    `;
    document.body.appendChild(homeButton);
    
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container game-container-template';
    gameContainer.style.width = "85%";
    gameContainer.style.maxWidth = "1200px";
    gameContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    gameContainer.style.borderRadius = "15px";
    gameContainer.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.5)";
    gameContainer.style.overflow = "hidden";
    gameContainer.style.margin = "20px";
    
    // Create game frame container
    const gameFrameContainer = document.createElement('div');
    gameFrameContainer.className = 'game-frame-container';
    gameFrameContainer.style.width = "100%";
    gameFrameContainer.style.height = "80vh";
    gameFrameContainer.style.position = "relative";
    
    // Add the game content
    if (existingIframe) {
        // Create a new iframe
        const gameFrame = document.createElement('iframe');
        gameFrame.id = 'game-frame';
        gameFrame.className = 'game-frame';
        gameFrame.src = gameSource;
        gameFrame.title = gameTitle;
        gameFrame.style.width = "100%";
        gameFrame.style.height = "100%";
        gameFrame.style.border = "none";
        gameFrame.style.display = "block";
        gameFrameContainer.appendChild(gameFrame);
    } else {
        // Add the original content
        gameFrameContainer.appendChild(originalContent);
        
        // Make sure the content fills the container
        originalContent.style.width = "100%";
        originalContent.style.height = "100%";
    }
    
    // Create controls bar
    const controlsBar = document.createElement('div');
    controlsBar.className = 'controls-bar';
    controlsBar.style.display = "flex";
    controlsBar.style.justifyContent = "space-between";
    controlsBar.style.alignItems = "center";
    controlsBar.style.padding = "10px 20px";
    controlsBar.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    controlsBar.style.borderTop = "1px solid rgba(255, 255, 255, 0.2)";
    
    // Create game title
    const gameTitleElement = document.createElement('h1');
    gameTitleElement.className = 'game-title';
    gameTitleElement.textContent = gameTitle;
    gameTitleElement.style.fontSize = "24px";
    gameTitleElement.style.fontWeight = "bold";
    gameTitleElement.style.textTransform = "lowercase";
    gameTitleElement.style.margin = "0";
    
    // Create control buttons
    const controlButtons = document.createElement('div');
    controlButtons.className = 'control-buttons';
    controlButtons.style.display = "flex";
    controlButtons.style.gap = "15px";
    
    // Create reload button
    const reloadButton = document.createElement('button');
    reloadButton.className = 'control-button';
    reloadButton.textContent = 'Reload';
    reloadButton.style.backgroundColor = "#007bff";
    reloadButton.style.color = "white";
    reloadButton.style.border = "none";
    reloadButton.style.borderRadius = "5px";
    reloadButton.style.padding = "8px 15px";
    reloadButton.style.cursor = "pointer";
    reloadButton.style.fontSize = "16px";
    reloadButton.style.transition = "all 0.3s ease";
    reloadButton.onclick = function() {
        if (existingIframe) {
            const gameFrame = document.querySelector('#game-frame');
            if (gameFrame) {
                gameFrame.src = gameFrame.src;
            }
        } else {
            // Reload the page for non-iframe games
            window.location.reload();
        }
    };
    
    // Create fullscreen button
    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'control-button';
    fullscreenButton.textContent = 'Fullscreen';
    fullscreenButton.style.backgroundColor = "#007bff";
    fullscreenButton.style.color = "white";
    fullscreenButton.style.border = "none";
    fullscreenButton.style.borderRadius = "5px";
    fullscreenButton.style.padding = "8px 15px";
    fullscreenButton.style.cursor = "pointer";
    fullscreenButton.style.fontSize = "16px";
    fullscreenButton.style.transition = "all 0.3s ease";
    fullscreenButton.onclick = function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            gameFrameContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    };
    
    // Add hover effect to buttons
    const addHoverEffect = (button) => {
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = "#0056b3";
            button.style.transform = "scale(1.05)";
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = "#007bff";
            button.style.transform = "scale(1)";
        });
    };
    
    addHoverEffect(reloadButton);
    addHoverEffect(fullscreenButton);
    addHoverEffect(homeButton);
    
    // Assemble the components
    controlButtons.appendChild(reloadButton);
    controlButtons.appendChild(fullscreenButton);
    controlsBar.appendChild(gameTitleElement);
    controlsBar.appendChild(controlButtons);
    gameContainer.appendChild(gameFrameContainer);
    gameContainer.appendChild(controlsBar);
    document.body.appendChild(gameContainer);
}

// Initialize game template when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add home button to all pages
    addHomeButton();
    
    // Create game template for game pages
    createGameTemplate();
    
    // Also check anti-close settings and emergency escape
    checkAndSetupEmergencyEscape();
    checkAntiCloseSettings();
    
    // Add a visual indicator if anti-close is enabled
    const isEnabled = localStorage.getItem('antiCloseEnabled') === 'true' || 
                     sessionStorage.getItem('antiCloseEnabled') === 'true';
    
    if (isEnabled) {
        // Show notification with a slight delay to ensure it's visible
        setTimeout(function() {
            showAntiCloseIndicator('🔒 Anti-close Protection: ACTIVE');
        }, 1000);
    }
});

// Function to check anti-close settings and apply if needed
function checkAntiCloseSettings() {
    const isEnabled = localStorage.getItem('antiCloseEnabled') === 'true' || 
                     sessionStorage.getItem('antiCloseEnabled') === 'true';
    
    console.log('Checking anti-close settings, enabled:', isEnabled, 'handler added:', antiCloseHandlerAdded);
    
    if (isEnabled && !antiCloseHandlerAdded) {
        console.log('Anti-close is enabled but handler not added, applying now');
        applyAntiClose();
    } else if (!isEnabled && antiCloseHandlerAdded) {
        console.log('Anti-close is disabled but handler is added, removing now');
        removeAntiClose();
    }
}

// Function to save anti-close settings
function saveAntiCloseSettings(isEnabled) {
    console.log('Saving anti-close settings:', isEnabled);
    
    // Save to both localStorage and sessionStorage for redundancy
    localStorage.setItem('antiCloseEnabled', isEnabled);
    sessionStorage.setItem('antiCloseEnabled', isEnabled);
    
    // Apply or remove protection
    if (isEnabled) {
        applyAntiClose();
    } else {
        removeAntiClose();
    }
} 
