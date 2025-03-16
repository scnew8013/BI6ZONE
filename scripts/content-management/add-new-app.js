// Script to add a new app to the website
const fs = require('fs');
const path = require('path');

// Check for command line arguments
if (process.argv.length < 5) {
    console.log('Usage: node add-new-app.js "App Name" app-url-slug "https://iframe-source-url" [category]');
    console.log('Example: node add-new-app.js "Gmail" gmail "https://mail.google.com" productivity');
    process.exit(1);
}

// Get arguments
const appName = process.argv[2];
const appSlug = process.argv[3]; // The URL slug (e.g., gmail)
const iframeUrl = process.argv[4]; // The iframe source URL
const category = process.argv[5] || 'productivity'; // Default to productivity if not specified

// Check if data-apps.js exists
const dataAppsPath = path.join(__dirname, 'data-apps.js');
if (!fs.existsSync(dataAppsPath)) {
    console.error('Error: data-apps.js not found!');
    process.exit(1);
}

// Create the app HTML file
const appHtmlPath = path.join(__dirname, 'a', `${appSlug}.html`);
const appDir = path.join(__dirname, 'a');

// Create the 'a' directory if it doesn't exist
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
    console.log('Created app directory at:', appDir);
}

// Create the HTML content for the app
const appHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <link rel="icon" href="https://files.catbox.moe/ao6qv3.png" type="image/png">
    <style>
        /* Base styles */
        body {
            background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROdNIejFmjeKC5u6Xq2yqOCa5y-uJseTCTfA&s') no-repeat center center fixed;
            background-size: cover;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            color: white;
        }
        
        /* App container */
        .app-container {
            width: 85%;
            max-width: 1200px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            overflow: hidden;
            margin: 20px;
        }
        
        /* App iframe */
        .app-frame {
            width: 100%;
            height: 80vh;
            border: none;
            display: block;
        }
        
        /* Controls bar */
        .controls-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.8);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* App title */
        .app-title {
            font-size: 24px;
            font-weight: bold;
            text-transform: lowercase;
            margin: 0;
        }
        
        /* Control buttons */
        .control-buttons {
            display: flex;
            gap: 15px;
        }
        
        .control-button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 15px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .control-button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }
        
        /* Home button */
        .home-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
            z-index: 100;
        }
        
        .home-button:hover {
            transform: scale(1.1);
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <!-- Home button -->
    <a href="/a.html" class="home-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    </a>
    
    <!-- App container -->
    <div class="app-container">
        <!-- App iframe will be dynamically inserted here -->
        <div id="app-frame-container">
            <iframe id="app-frame" class="app-frame" src="${iframeUrl}" title="${appName}"></iframe>
        </div>
        
        <!-- Controls bar -->
        <div class="controls-bar">
            <h1 id="app-title" class="app-title">${appName}</h1>
            <div class="control-buttons">
                <button class="control-button" onclick="reloadApp()">Reload</button>
                <button class="control-button" onclick="toggleFullscreen()">Fullscreen</button>
            </div>
        </div>
    </div>
    
    <script>
        // Function to reload the app
        function reloadApp() {
            const appFrame = document.getElementById('app-frame');
            appFrame.src = appFrame.src;
        }
        
        // Function to toggle fullscreen
        function toggleFullscreen() {
            const appFrame = document.getElementById('app-frame');
            
            if (document.fullscreenElement) {
                document.exitFullscreen().then(() => {
                    // Always reload after exiting fullscreen
                    setTimeout(reloadApp, 300);
                });
            } else {
                appFrame.requestFullscreen().then(() => {
                    // Always reload after entering fullscreen
                    setTimeout(reloadApp, 300);
                }).catch(err => {
                    console.error('Error attempting to enable fullscreen:', err.message);
                });
            }
        }
        
        // Add fullscreen change event listener
        document.addEventListener('fullscreenchange', function() {
            // Additional code can be added here if needed
        });
    </script>
    <script src="../shared.js"></script>
</body>
</html>`;

// Write the HTML file
try {
    fs.writeFileSync(appHtmlPath, appHtml);
    console.log(`✅ Created ${appSlug}.html with the standard app layout`);
} catch (err) {
    console.error(`❌ Error creating HTML file:`, err);
    process.exit(1);
}

// Now we need to add this app to data-apps.js
try {
    // Read data-apps.js
    const dataAppsContent = fs.readFileSync(dataAppsPath, 'utf8');
    
    // Generate new app entry
    const appEntry = `    {
        id: "${appSlug}",
        name: "${appName}",
        url: "/a/${appSlug}.html",
        iframeUrl: "${iframeUrl}",
        imageUrl: "placeholder-image-url", // Update this with a real image URL
        popular: false,
        new: true,
        category: "${category}"
    },`;
    
    // Find where to insert the new app entry
    let updatedContent = '';
    if (dataAppsContent.includes('const appsData = [')) {
        // Insert after the opening bracket of appsData
        updatedContent = dataAppsContent.replace('const appsData = [', 'const appsData = [\n' + appEntry);
    } else {
        console.error('❌ Could not find the appsData array in data-apps.js');
        process.exit(1);
    }
    
    // Write the updated content back to data-apps.js
    fs.writeFileSync(dataAppsPath, updatedContent);
    console.log(`✅ Added ${appName} to data-apps.js`);
    
    console.log('\n📱 App added successfully!');
    console.log(`\nImportant: Update the image URL in data-apps.js with a real image URL for ${appName}`);
    
} catch (err) {
    console.error(`❌ Error updating data-apps.js:`, err);
    process.exit(1);
} 