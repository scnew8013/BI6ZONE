// Script to update a.html to use the new template approach
const fs = require('fs');
const path = require('path');

// Path to the a.html file
const aHtmlPath = path.join(__dirname, 'a.html');

// Read the a.html file
try {
    const content = fs.readFileSync(aHtmlPath, 'utf8');
    
    // Regular expression to find all app links
    // This pattern matches the onclick attribute that contains a link to an app HTML file
    const pattern = /onclick="window\.location\.href='\/a\/([^']+)\.html'"/g;
    
    // Replace all matches with links to the app.html template
    const updatedContent = content.replace(pattern, (match, appId) => {
        return `onclick="window.location.href='app.html?id=${appId}'"`;
    });
    
    // Write the updated content back to a.html
    fs.writeFileSync(aHtmlPath, updatedContent);
    
    console.log('✅ Updated a.html with links to the new app.html template');
    
    // Count how many links were updated
    const originalMatches = content.match(pattern);
    const updatedMatches = updatedContent.match(/onclick="window\.location\.href='app\.html\?id=([^']+)'"/g);
    
    console.log(`Updated ${originalMatches ? originalMatches.length : 0} app links`);
    
} catch (err) {
    console.error('❌ Error updating a.html:', err);
} 