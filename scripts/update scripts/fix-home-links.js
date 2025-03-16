// Script to fix home links in all game HTML files
const fs = require('fs');
const path = require('path');

// Directory where game HTML files are located
const gameDir = path.join(__dirname, 'g');

// Also check the game-player.html file
const additionalFiles = ['game-player.html'];

// Get all files in the game directory
let gameFiles = [];
try {
    gameFiles = fs.readdirSync(gameDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(gameDir, file));
    
    // Add any additional files
    additionalFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            gameFiles.push(filePath);
        }
    });
    
    console.log(`Found ${gameFiles.length} HTML files to check and update.`);
} catch (err) {
    console.error('Error reading game directory:', err);
    process.exit(1);
}

// Counter for modified files
let modifiedCount = 0;

// Process each file
gameFiles.forEach(filePath => {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if it contains a reference to g-new.html
        if (content.includes('g-new.html')) {
            // Replace g-new.html with g.html
            const updatedContent = content.replace(/g-new\.html/g, 'g.html');
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, updatedContent);
            
            modifiedCount++;
            console.log(`✅ Updated ${path.basename(filePath)}`);
        }
    } catch (err) {
        console.error(`❌ Error processing ${filePath}:`, err);
    }
});

console.log(`Done! Modified ${modifiedCount} files to point to g.html instead of g-new.html.`); 