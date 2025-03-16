/**
 * Update References Script
 * Updates references to files in their new locations in all HTML files
 */

const fs = require('fs');
const path = require('path');

// File paths to update
const pathUpdates = [
    // Data files
    { old: 'data-games.js', new: 'data/data-games.js' },
    { old: 'data-apps.js', new: 'data/data-apps.js' },
    { old: 'data-movies.js', new: 'data/data-movies.js' },
    
    // Template files
    { old: 'game.html', new: 'templates/game.html' },
    { old: 'app.html', new: 'templates/app.html' },
    { old: 'game-player.html', new: 'templates/game-player.html' },
    { old: 'app-player.html', new: 'templates/app-player.html' },
    
    // Utility scripts
    { old: 'tab-cloak.js', new: 'scripts/utilities/tab-cloak.js' },
    { old: 'shared.js', new: 'scripts/utilities/shared.js' }
];

// Function to update file paths in a single file
function updateFileReferences(filePath) {
    console.log(`Processing ${filePath}...`);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changes = 0;
        
        // Apply all path updates
        for (const update of pathUpdates) {
            // Handle src attributes
            const srcPattern = new RegExp(`src=["']${update.old}["']`, 'g');
            const srcMatches = content.match(srcPattern) || [];
            if (srcMatches.length > 0) {
                console.log(`  Found ${srcMatches.length} src attributes for ${update.old}`);
                content = content.replace(srcPattern, `src="${update.new}"`);
                changes += srcMatches.length;
            }
            
            // Handle href attributes
            const hrefPattern = new RegExp(`href=["']${update.old}["']`, 'g');
            const hrefMatches = content.match(hrefPattern) || [];
            if (hrefMatches.length > 0) {
                console.log(`  Found ${hrefMatches.length} href attributes for ${update.old}`);
                content = content.replace(hrefPattern, `href="${update.new}"`);
                changes += hrefMatches.length;
            }
            
            // Handle JavaScript references
            const jsPattern = new RegExp(`window\\.location\\.href=["']${update.old}`, 'g');
            const jsMatches = content.match(jsPattern) || [];
            if (jsMatches.length > 0) {
                console.log(`  Found ${jsMatches.length} JavaScript references for ${update.old}`);
                content = content.replace(jsPattern, `window.location.href="${update.new}`);
                changes += jsMatches.length;
            }
        }
        
        // Write the file if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Updated ${changes} references in ${filePath}`);
            return true;
        } else {
            console.log(`⚠️ No references to update in ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error updating references in ${filePath}:`, error);
        return false;
    }
}

// Function to update all HTML files
function updateAllHtmlFiles() {
    console.log('Updating references in all HTML files...');
    
    try {
        // Get all HTML files in the root directory
        const htmlFiles = fs.readdirSync('.')
            .filter(file => file.endsWith('.html'));
        
        console.log(`Found ${htmlFiles.length} HTML files to check`);
        
        let updatedFiles = 0;
        
        // Update each HTML file
        for (const htmlFile of htmlFiles) {
            if (updateFileReferences(htmlFile)) {
                updatedFiles++;
            }
        }
        
        console.log(`\nUpdate summary:`);
        console.log(`- Successfully updated ${updatedFiles} of ${htmlFiles.length} HTML files`);
        
        return updatedFiles;
    } catch (error) {
        console.error('❌ Error updating HTML files:', error);
        return 0;
    }
}

// Run the update function
updateAllHtmlFiles(); 