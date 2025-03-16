// Script to add a new game to the website
const fs = require('fs');
const path = require('path');

// Check for command line arguments
if (process.argv.length < 5) {
    console.log('Usage: node add-new-game.js "Game Name" game-url-slug "https://iframe-source-url" [category]');
    console.log('Example: node add-new-game.js "Monkey Mart" monkey-mart "https://x12maybeheat.vercel.app/games/monkeymart/index.html" action');
    process.exit(1);
}

// Get arguments
const gameName = process.argv[2];
const gameSlug = process.argv[3]; // The URL slug (e.g., monkey-mart)
const iframeUrl = process.argv[4]; // The iframe source URL
const category = process.argv[5] || 'popular'; // Default to popular if not specified

// Check if data-games.js exists
const dataGamesPath = path.join(__dirname, 'data-games.js');
if (!fs.existsSync(dataGamesPath)) {
    console.error('Error: data-games.js not found!');
    process.exit(1);
}

// Create the game HTML file
const gameHtmlPath = path.join(__dirname, 'g', `${gameSlug}.html`);
const gameDir = path.join(__dirname, 'g');

// Create the 'g' directory if it doesn't exist
if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir, { recursive: true });
    console.log('Created game directory at:', gameDir);
}

// Create the HTML content for the game
const gameHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameName}</title>
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
        
        /* Game container */
        .game-container {
            width: 85%;
            max-width: 1200px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            overflow: hidden;
            margin: 20px;
        }
        
        /* Game iframe */
        .game-frame {
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
        
        /* Game title */
        .game-title {
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
    <a href="/g.html" class="home-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    </a>
    
    <!-- Game container -->
    <div class="game-container">
        <!-- Game iframe will be dynamically inserted here -->
        <div id="game-frame-container">
            <iframe id="game-frame" class="game-frame" src="${iframeUrl}" title="${gameName}"></iframe>
        </div>
        
        <!-- Controls bar -->
        <div class="controls-bar">
            <h1 id="game-title" class="game-title">${gameName}</h1>
            <div class="control-buttons">
                <button class="control-button" onclick="reloadGame()">Reload</button>
                <button class="control-button" onclick="toggleFullscreen()">Fullscreen</button>
            </div>
        </div>
    </div>
    
    <script>
        // Function to reload the game
        function reloadGame() {
            const gameFrame = document.getElementById('game-frame');
            gameFrame.src = gameFrame.src;
        }
        
        // Function to toggle fullscreen
        function toggleFullscreen() {
            const gameFrame = document.getElementById('game-frame');
            
            if (document.fullscreenElement) {
                document.exitFullscreen().then(() => {
                    // Always reload after exiting fullscreen
                    setTimeout(reloadGame, 300);
                });
            } else {
                gameFrame.requestFullscreen().then(() => {
                    // Always reload after entering fullscreen
                    setTimeout(reloadGame, 300);
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
    fs.writeFileSync(gameHtmlPath, gameHtml);
    console.log(`✅ Created ${gameSlug}.html with the standard game layout`);
} catch (err) {
    console.error(`❌ Error creating HTML file:`, err);
    process.exit(1);
}

// Now we need to add this game to data-games.js
try {
    // Read data-games.js
    const dataGamesContent = fs.readFileSync(dataGamesPath, 'utf8');
    
    // Generate new game entry
    const gameEntry = `  {
    id: "${gameSlug}",
    name: "${gameName}",
    url: "/g/${gameSlug}.html",
    iframeUrl: "${iframeUrl}",
    imageUrl: "placeholder-image-url", // Update this with a real image URL
    popular: false,
    new: true,
    broken: false,
    fullscreenReload: true,
    category: "${category}"
  },`;
    
    // Find where to insert the new game entry
    let updatedContent = '';
    if (dataGamesContent.includes('const gamesData = [')) {
        // Insert after the opening bracket of gamesData
        updatedContent = dataGamesContent.replace('const gamesData = [', 'const gamesData = [\n' + gameEntry);
    } else {
        console.error('❌ Could not find the gamesData array in data-games.js');
        process.exit(1);
    }
    
    // Write the updated content back to data-games.js
    fs.writeFileSync(dataGamesPath, updatedContent);
    console.log(`✅ Added ${gameName} to data-games.js`);
    
    console.log('\n🎮 Game added successfully!');
    console.log(`\nImportant: Update the image URL in data-games.js with a real image URL for ${gameName}`);
    
} catch (err) {
    console.error(`❌ Error updating data-games.js:`, err);
    process.exit(1);
} 