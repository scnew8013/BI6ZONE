// Script to apply the fullscreen reload layout to ALL app HTML files
const fs = require('fs');
const path = require('path');

// Load app data (if available)
let appsData = [];
try {
    const appDataPath = path.join(__dirname, 'data-apps.js');
    if (fs.existsSync(appDataPath)) {
        appsData = require('./data-apps.js').appsData;
        console.log(`Processing ${appsData.length} apps from data-apps.js...`);
    } else {
        console.log('No data-apps.js found, please create one for automatic app updates');
    }
} catch (err) {
    console.error('Error loading app data:', err);
    appsData = [];
}

// Directory where app HTML files are located
const appDir = path.join(__dirname, 'a');

// If no apps directory, create one
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
    console.log('Created apps directory at:', appDir);
}

// Function to update a single app file
function updateAppFile(app) {
    // Extract just the filename from the URL
    const filename = app.url.split('/').pop();
    const filePath = path.join(appDir, filename);

    // Try to get the source URL from the existing file
    let sourceUrl = '';
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const match = content.match(/<iframe[^>]*src=["']([^"']*)["'][^>]*>/i);
            if (match && match[1]) {
                sourceUrl = match[1];
            }
        }
    } catch (err) {
        console.log(`Could not read existing file ${filename}, will use default source if available`);
    }

    // If we couldn't find a source URL in the file, check if we have one in our data
    if (!sourceUrl && app.iframeUrl) {
        sourceUrl = app.iframeUrl;
    }

    // If we still don't have a source URL, we'll need to skip this app
    if (!sourceUrl) {
        console.log(`⚠️ Warning: No source URL found for ${app.name}. Please update the file manually.`);
        return; // Skip this app
    }

    // Create a new HTML file with the fullscreen reload layout
    const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${app.name}</title>
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
            <iframe id="app-frame" class="app-frame" src="${sourceUrl}" title="${app.name}"></iframe>
        </div>
        
        <!-- Controls bar -->
        <div class="controls-bar">
            <h1 id="app-title" class="app-title">${app.name}</h1>
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

    try {
        // Write the new file
        fs.writeFileSync(filePath, newHtml);
        console.log(`✅ Updated ${filename} with fullscreen reload layout`);
    } catch (err) {
        console.error(`❌ Error updating ${filename}:`, err);
    }
}

// Process each app in our data
if (appsData.length > 0) {
    appsData.forEach(updateAppFile);
} else {
    console.log('No app data found. Please update data-apps.js with your app entries.');
}

console.log('All app files have been updated with the fullscreen reload layout!'); 