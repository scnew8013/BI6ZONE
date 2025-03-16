/**
 * Update File Paths Script
 * Updates file paths in HTML files to reflect the new directory structure
 */

const fs = require('fs');
const path = require('path');

// Update paths in HTML files
function updateFilePathsInHtmlFiles() {
    console.log('Updating file paths in HTML files...');
    
    // Get all HTML files in the root directory
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    let updatedFiles = 0;
    
    // Process each HTML file
    for (const htmlFile of htmlFiles) {
        let content = fs.readFileSync(htmlFile, 'utf8');
        let originalContent = content;
        
        // Update paths
        content = content
            // Update data file references
            .replace(/src="data-games\.js"/g, 'src="data/data-games.js"')
            .replace(/src="data-apps\.js"/g, 'src="data/data-apps.js"')
            .replace(/src="data-movies\.js"/g, 'src="data/data-movies.js"')
            
            // Update template references
            .replace(/href="game\.html/g, 'href="templates/game.html')
            .replace(/href="app\.html/g, 'href="templates/app.html')
            .replace(/href="game-player\.html/g, 'href="templates/game-player.html')
            .replace(/href="app-player\.html/g, 'href="templates/app-player.html')
            
            // Update script references
            .replace(/src="shared\.js"/g, 'src="scripts/utilities/shared.js"')
            .replace(/src="tab-cloak\.js"/g, 'src="scripts/utilities/tab-cloak.js"');
        
        // Only write if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(htmlFile, content);
            console.log(`Updated file paths in ${htmlFile}`);
            updatedFiles++;
        }
    }
    
    console.log(`Updated file paths in ${updatedFiles} HTML files`);
    return updatedFiles > 0;
}

// Update game links
function updateGameLinks() {
    console.log('Updating game links...');
    
    const gHtml = fs.readFileSync('g.html', 'utf8');
    
    // Replace links to game.html with templates/game.html
    const updatedGHtml = gHtml.replace(
        /window\.location\.href='game\.html/g, 
        "window.location.href='templates/game.html"
    );
    
    if (updatedGHtml !== gHtml) {
        fs.writeFileSync('g.html', updatedGHtml);
        console.log('Updated game links in g.html');
        return true;
    }
    
    return false;
}

// Update app links
function updateAppLinks() {
    console.log('Updating app links...');
    
    const aHtml = fs.readFileSync('a.html', 'utf8');
    
    // Replace links to app.html with templates/app.html
    const updatedAHtml = aHtml.replace(
        /window\.location\.href='app\.html/g, 
        "window.location.href='templates/app.html"
    );
    
    if (updatedAHtml !== aHtml) {
        fs.writeFileSync('a.html', updatedAHtml);
        console.log('Updated app links in a.html');
        return true;
    }
    
    return false;
}

// Main function
function updateAllPaths() {
    console.log('Updating all file paths...');
    
    const results = {
        htmlFiles: updateFilePathsInHtmlFiles(),
        gameLinks: updateGameLinks(),
        appLinks: updateAppLinks()
    };
    
    console.log('Path update results:', results);
    return results;
}

// Run the main function
updateAllPaths(); 