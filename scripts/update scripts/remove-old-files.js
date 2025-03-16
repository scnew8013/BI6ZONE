/**
 * Remove Old Files Script
 * Safely removes old files after verifying they exist in their new locations
 */

const fs = require('fs');
const path = require('path');

// Files to check and remove
const filesToCheck = [
    // Data files
    { old: 'data-games.js', new: 'data/data-games.js' },
    { old: 'data-apps.js', new: 'data/data-apps.js' },
    { old: 'data-movies.js', new: 'data/data-movies.js' },
    
    // Template files
    { old: 'game.html', new: 'templates/game.html' },
    { old: 'app.html', new: 'templates/app.html' },
    { old: 'game-player.html', new: 'templates/game-player.html' },
    { old: 'app-player.html', new: 'templates/app-player.html' },
    
    // Content management scripts
    { old: 'add-new-game.js', new: 'scripts/content-management/add-new-game.js' },
    { old: 'add-new-app.js', new: 'scripts/content-management/add-new-app.js' },
    
    // Utility scripts
    { old: 'tab-cloak.js', new: 'scripts/utilities/tab-cloak.js' },
    { old: 'shared.js', new: 'scripts/utilities/shared.js' },
    
    // Update scripts
    { old: 'a-update.js', new: 'scripts/update-scripts/a-update.js' },
    { old: 'g-update.js', new: 'scripts/update-scripts/g-update.js' },
    { old: 'fix-home-links.js', new: 'scripts/update-scripts/fix-home-links.js' },
    { old: 'fix-special-games.js', new: 'scripts/update-scripts/fix-special-games.js' }
];

// Function to check if a file exists
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        console.error(`Error checking if file exists: ${filePath}`, error);
        return false;
    }
}

// Function to remove a file
function removeFile(filePath) {
    try {
        fs.unlinkSync(filePath);
        return true;
    } catch (error) {
        console.error(`Error removing file: ${filePath}`, error);
        return false;
    }
}

// Main function to remove old files
function removeOldFiles() {
    console.log('Checking and removing old files...');
    
    let removed = 0;
    let notRemoved = 0;
    
    for (const file of filesToCheck) {
        const oldPath = path.join(__dirname, '../..', file.old);
        const newPath = path.join(__dirname, '../..', file.new);
        
        // Check if the new file exists
        if (fileExists(newPath)) {
            console.log(`✅ New file exists: ${file.new}`);
            
            // Check if the old file exists
            if (fileExists(oldPath)) {
                // Remove the old file
                if (removeFile(oldPath)) {
                    console.log(`🗑️ Removed old file: ${file.old}`);
                    removed++;
                } else {
                    console.log(`❌ Failed to remove old file: ${file.old}`);
                    notRemoved++;
                }
            } else {
                console.log(`⚠️ Old file doesn't exist: ${file.old}`);
            }
        } else {
            console.log(`❌ New file doesn't exist: ${file.new}`);
            console.log(`⚠️ Keeping old file: ${file.old}`);
            notRemoved++;
        }
    }
    
    console.log(`\nRemoval summary:`);
    console.log(`- Successfully removed: ${removed} files`);
    console.log(`- Not removed: ${notRemoved} files`);
    
    return { removed, notRemoved };
}

// Run the main function
removeOldFiles(); 