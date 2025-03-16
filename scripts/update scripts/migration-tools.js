/**
 * Migration Tools Script
 * Combines functionality from g-update.js, a-update.js, and other migration scripts
 * Used for updating HTML files and migrating to the template-based system
 */

const fs = require('fs');
const path = require('path');

// Utility function to read a file
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

// Utility function to write a file
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
        return true;
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        return false;
    }
}

// Update game links to use the template system
function updateGameLinks() {
    console.log('Updating game links to use the template system...');
    
    try {
        // Read the g.html file
        const gHtmlPath = path.join(__dirname, '../../g.html');
        let gHtml = readFile(gHtmlPath);
        
        if (!gHtml) return false;
        
        // Find all game links in the format onclick="window.location.href='/g/game-name.html'"
        const gameLinkRegex = /onclick="window\.location\.href='\/g\/([^']+)\.html'"/g;
        
        // Replace with links to the template: onclick="window.location.href='game.html?id=game-name'"
        gHtml = gHtml.replace(gameLinkRegex, (match, gameName) => {
            return `onclick="window.location.href='game.html?id=${gameName}'"`;
        });
        
        // Write the updated file
        if (writeFile(gHtmlPath, gHtml)) {
            console.log('Successfully updated game links in g.html');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating game links:', error);
        return false;
    }
}

// Update app links to use the template system
function updateAppLinks() {
    console.log('Updating app links to use the template system...');
    
    try {
        // Read the a.html file
        const aHtmlPath = path.join(__dirname, '../../a.html');
        let aHtml = readFile(aHtmlPath);
        
        if (!aHtml) return false;
        
        // Find all app links in the format onclick="window.location.href='/a/app-name.html'"
        const appLinkRegex = /onclick="window\.location\.href='\/a\/([^']+)\.html'"/g;
        
        // Replace with links to the template: onclick="window.location.href='app.html?id=app-name'"
        aHtml = aHtml.replace(appLinkRegex, (match, appName) => {
            return `onclick="window.location.href='app.html?id=${appName}'"`;
        });
        
        // Write the updated file
        if (writeFile(aHtmlPath, aHtml)) {
            console.log('Successfully updated app links in a.html');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating app links:', error);
        return false;
    }
}

// Update movie links to use the template system
function updateMovieLinks() {
    console.log('Updating movie links to use the template system...');
    
    try {
        // Read the m.html file
        const mHtmlPath = path.join(__dirname, '../../m.html');
        let mHtml = readFile(mHtmlPath);
        
        if (!mHtml) return false;
        
        // Find all movie links in the format onclick="window.location.href='/m/movie-name.html'"
        const movieLinkRegex = /onclick="window\.location\.href='\/m\/([^']+)\.html'"/g;
        
        // Replace with links to the template: onclick="window.location.href='movie.html?id=movie-name'"
        mHtml = mHtml.replace(movieLinkRegex, (match, movieName) => {
            return `onclick="window.location.href='movie.html?id=${movieName}'"`;
        });
        
        // Write the updated file
        if (writeFile(mHtmlPath, mHtml)) {
            console.log('Successfully updated movie links in m.html');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating movie links:', error);
        return false;
    }
}

// Fix home links in game pages
function fixHomeLinks() {
    console.log('Fixing home links in game pages...');
    
    try {
        // Get all game HTML files
        const gamesDir = path.join(__dirname, '../../g');
        const gameFiles = fs.readdirSync(gamesDir).filter(file => file.endsWith('.html'));
        
        let successCount = 0;
        
        // Process each game file
        for (const gameFile of gameFiles) {
            const filePath = path.join(gamesDir, gameFile);
            let content = readFile(filePath);
            
            if (!content) continue;
            
            // Replace incorrect home links with correct ones
            const oldHomeLink = /href="\/index.html"/g;
            const newHomeLink = 'href="/g.html"';
            
            if (content.includes(oldHomeLink)) {
                content = content.replace(oldHomeLink, newHomeLink);
                
                if (writeFile(filePath, content)) {
                    successCount++;
                }
            }
        }
        
        console.log(`Fixed home links in ${successCount} game files`);
        return successCount > 0;
    } catch (error) {
        console.error('Error fixing home links:', error);
        return false;
    }
}

// Add tab-cloak.js to all HTML files
function addTabCloakToAllPages() {
    console.log('Adding tab-cloak.js to all HTML files...');
    
    try {
        // Get all HTML files in the root directory
        const rootDir = path.join(__dirname, '../..');
        const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));
        
        let successCount = 0;
        
        // Process each HTML file
        for (const htmlFile of htmlFiles) {
            const filePath = path.join(rootDir, htmlFile);
            let content = readFile(filePath);
            
            if (!content) continue;
            
            // Check if tab-cloak.js is already included
            if (!content.includes('tab-cloak.js')) {
                // Add tab-cloak.js after the head tag
                const headTag = '<head>';
                const tabCloakScript = '<head>\n    <!-- Tab Cloaking Script -->\n    <script src="scripts/utilities/tab-features.js"></script>';
                
                content = content.replace(headTag, tabCloakScript);
                
                if (writeFile(filePath, content)) {
                    successCount++;
                }
            }
        }
        
        console.log(`Added tab-cloak.js to ${successCount} HTML files`);
        return successCount > 0;
    } catch (error) {
        console.error('Error adding tab-cloak.js:', error);
        return false;
    }
}

// Run all migration tools
function runAllMigrations() {
    console.log('Running all migration tools...');
    
    const results = {
        gameLinks: updateGameLinks(),
        appLinks: updateAppLinks(),
        movieLinks: updateMovieLinks(),
        homeLinks: fixHomeLinks(),
        tabCloak: addTabCloakToAllPages()
    };
    
    console.log('Migration results:', results);
    return results;
}

// Export the functions
module.exports = {
    updateGameLinks,
    updateAppLinks,
    updateMovieLinks,
    fixHomeLinks,
    addTabCloakToAllPages,
    runAllMigrations
}; 