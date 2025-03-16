// Script to update all HTML files with the tab-cloak.js script
const fs = require('fs');
const path = require('path');

// List of main HTML files to update
const htmlFiles = [
    'index.html',
    'g.html',
    'a.html',
    'e.html',
    'm.html',
    's.html',
    'game.html',
    'app.html',
    'discord.html'
];

// Tab cloak script tag to insert
const tabCloakScript = '\n    <!-- Tab Cloaking Script -->\n    <script src="tab-cloak.js"></script>\n';

// Process each file
htmlFiles.forEach(fileName => {
    try {
        const filePath = path.join(__dirname, fileName);
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log(`File ${fileName} not found. Skipping.`);
            return;
        }
        
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the tab-cloak script is already included
        if (content.includes('tab-cloak.js')) {
            console.log(`File ${fileName} already has tab-cloak.js. Skipping.`);
            return;
        }
        
        // Find the </head> tag to insert before
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex === -1) {
            console.log(`Could not find </head> tag in ${fileName}. Skipping.`);
            return;
        }
        
        // Insert the tab cloak script before </head>
        const updatedContent = content.substring(0, headEndIndex) + 
                               tabCloakScript + 
                               content.substring(headEndIndex);
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        console.log(`Updated ${fileName} with tab-cloak.js script.`);
    } catch (error) {
        console.error(`Error updating ${fileName}:`, error.message);
    }
});

console.log('Update complete.'); 