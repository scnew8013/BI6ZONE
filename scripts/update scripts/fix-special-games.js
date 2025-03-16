// Script to fix special games that don't use a simple iframe
const fs = require('fs');
const path = require('path');

// Directory where game HTML files are located
const gameDir = path.join(__dirname, 'g');

// Special games that need manual handling
const specialGames = [
    {
        filename: 'granny-offline.html',
        contentType: 'unity'
    },
    {
        filename: '2048-cupcakes.html',
        contentType: 'custom'
    },
    {
        filename: 'infinite-craft.html',
        contentType: 'custom'
    },
    {
        filename: 'amaze.html',
        contentType: 'custom'
    },
    {
        filename: 'bolly-beat.html',
        contentType: 'custom'
    },
    {
        filename: 'bubble-shooter.html',
        contentType: 'custom'
    },
    {
        filename: 'color-water-sort.html',
        contentType: 'custom'
    },
    {
        filename: 'granny-2.html',
        contentType: 'unity'
    },
    {
        filename: 'hide-n-seek.html',
        contentType: 'custom'
    },
    {
        filename: 'hole-io.html',
        contentType: 'custom'
    },
    {
        filename: 'lucky-blocks.html',
        contentType: 'custom'
    },
    {
        filename: 'magic-tiles-3.html',
        contentType: 'custom'
    },
    {
        filename: 'minecraft-parkour.html',
        contentType: 'custom'
    },
    {
        filename: 'minecraft-shooter.html',
        contentType: 'custom'
    },
    {
        filename: 'my-perfect-hotel.html',
        contentType: 'custom'
    },
    {
        filename: 'only-up.html',
        contentType: 'custom'
    },
    {
        filename: 'shreks-hotel.html',
        contentType: 'custom'
    },
    {
        filename: 'sky-race-3d.html',
        contentType: 'custom'
    },
    {
        filename: 'slide-in-the-woods.html',
        contentType: 'custom'
    },
    {
        filename: 'slither-io.html',
        contentType: 'custom'
    },
    {
        filename: 'snowball-io.html',
        contentType: 'custom'
    },
    {
        filename: 'zen-word.html',
        contentType: 'custom'
    }
];

// Process a special game file based on its type
function processSpecialGame(gameInfo) {
    const filePath = path.join(gameDir, gameInfo.filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File not found: ${gameInfo.filename}`);
        return;
    }
    
    // Read the current file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the game name from the title tag or filename
    let gameName = gameInfo.filename.replace('.html', '').replace(/-/g, ' ');
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        gameName = titleMatch[1].trim();
    }
    
    // Create a new HTML with the template, preserving the original content
    let newHtml = `<!DOCTYPE html>
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
        
        /* Game content */
        .game-content {
            width: 100%;
            height: 80vh;
            position: relative;
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
        
        /* Original game styles - preserved from the source */
        ${extractStyles(content)}
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
        <!-- Game content -->
        <div id="game-content-container" class="game-content">
            ${extractGameContent(content, gameInfo.contentType)}
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
            location.reload();
        }
        
        // Function to toggle fullscreen
        function toggleFullscreen() {
            const gameContainer = document.querySelector('.game-container');
            
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                gameContainer.requestFullscreen().catch(err => {
                    console.error('Error attempting to enable fullscreen:', err.message);
                });
            }
        }
        
        // Add fullscreen change event listener
        document.addEventListener('fullscreenchange', function() {
            // Additional code can be added here if needed
        });
        
        // Original game scripts - preserved from the source
        ${extractScripts(content)}
    </script>
    <script src="../shared.js"></script>
</body>
</html>`;

    try {
        // Write the new file
        fs.writeFileSync(filePath, newHtml);
        console.log(`✅ Updated ${gameInfo.filename} with fullscreen reload layout`);
    } catch (err) {
        console.error(`❌ Error updating ${gameInfo.filename}:`, err);
    }
}

// Function to extract styles from the original content
function extractStyles(content) {
    const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!styleMatches) return '';
    
    // Extract just the style content without the style tags
    let styles = '';
    for (const styleTag of styleMatches) {
        const styleContent = styleTag.replace(/<style[^>]*>|<\/style>/gi, '');
        styles += styleContent + '\n';
    }
    return styles;
}

// Function to extract game content based on type
function extractGameContent(content, contentType) {
    switch (contentType) {
        case 'unity':
            // For Unity games, extract the unity container
            const unityMatch = content.match(/<div id="unity-container"[\s\S]*?<\/div>/i);
            return unityMatch ? unityMatch[0] : '<div>Error: Unity content not found</div>';
        
        case 'custom':
            // For custom games, extract the body content between body tags
            const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                // Remove any script tags that will be handled separately
                let bodyContent = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '');
                // Remove any shared.js references
                bodyContent = bodyContent.replace(/<script src=['"]\.\.\/shared\.js['"]><\/script>/gi, '');
                return bodyContent.trim();
            }
            return '<div>Error: Game content not found</div>';
            
        default:
            return '<div>Error: Unknown content type</div>';
    }
}

// Function to extract scripts from the original content
function extractScripts(content) {
    const scriptMatches = content.match(/<script(?![^>]*src=['"]\.\.\/shared\.js['"])[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatches) return '';
    
    // Extract just the script content without the script tags
    let scripts = '';
    for (const scriptTag of scriptMatches) {
        // Skip shared.js
        if (scriptTag.includes('src="../shared.js"')) continue;
        
        // For external scripts, keep the whole tag
        if (scriptTag.includes('src=')) {
            scripts += scriptTag + '\n';
        } else {
            // For inline scripts, extract just the content
            const scriptContent = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '');
            scripts += scriptContent + '\n';
        }
    }
    return scripts;
}

// Process all special games
specialGames.forEach(processSpecialGame);
console.log('All special game files have been processed!'); 