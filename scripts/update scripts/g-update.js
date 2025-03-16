// Script to update g.html to use the new template approach
const fs = require('fs');
const path = require('path');

// Path to the g.html file
const gHtmlPath = path.join(__dirname, 'g.html');

// Read the g.html file
try {
    const content = fs.readFileSync(gHtmlPath, 'utf8');
    
    // Regular expression to find all game links
    // This pattern matches the onclick attribute that contains a link to a game HTML file
    const pattern = /onclick="window\.location\.href='\/g\/([^']+)\.html'"/g;
    
    // Replace all matches with links to the game.html template
    const updatedContent = content.replace(pattern, (match, gameId) => {
        return `onclick="window.location.href='game.html?id=${gameId}'"`;
    });
    
    // Write the updated content back to g.html
    fs.writeFileSync(gHtmlPath, updatedContent);
    
    console.log('✅ Updated g.html with links to the new game.html template');
    
    // Count how many links were updated
    const originalMatches = content.match(pattern);
    const updatedMatches = updatedContent.match(/onclick="window\.location\.href='game\.html\?id=([^']+)'"/g);
    
    console.log(`Updated ${originalMatches ? originalMatches.length : 0} game links`);
    
} catch (err) {
    console.error('❌ Error updating g.html:', err);
} 