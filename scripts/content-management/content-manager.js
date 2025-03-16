/**
 * Content Manager Script
 * This script combines functionality from add-new-game.js and add-new-app.js
 * Provides tools for adding and managing content on the website
 */

// Function to add a new game to data-games.js
function addNewGame(gameData) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Read the current games data
        const dataPath = path.join(__dirname, '../../data-games.js');
        let content = fs.readFileSync(dataPath, 'utf8');
        
        // Extract the games array
        const gamesArrayStart = content.indexOf('const gamesData = [');
        const gamesArrayEnd = content.indexOf('];', gamesArrayStart) + 1;
        const gamesArrayText = content.substring(gamesArrayStart, gamesArrayEnd);
        
        // Create the new game entry
        const newGameEntry = `
  {
    id: "${gameData.id}",
    name: "${gameData.name}",
    url: "/g/${gameData.id}.html",
    iframeUrl: "${gameData.iframeUrl}",
    imageUrl: "${gameData.imageUrl}",
    popular: ${gameData.popular || false},
    new: ${gameData.new || true},
    broken: ${gameData.broken || false},
    fullscreenReload: ${gameData.fullscreenReload || true},
    category: "${gameData.category}"
  },`;
        
        // Insert the new game at the beginning of the array after the opening bracket and first comment
        const insertPosition = gamesArrayText.indexOf('[') + 1;
        const updatedGamesArray = 
            gamesArrayText.substring(0, insertPosition) + 
            newGameEntry + 
            gamesArrayText.substring(insertPosition);
        
        // Replace the old games array with the updated one
        const updatedContent = 
            content.substring(0, gamesArrayStart) + 
            updatedGamesArray + 
            content.substring(gamesArrayEnd);
        
        // Write the updated content back to the file
        fs.writeFileSync(dataPath, updatedContent);
        
        console.log(`Successfully added game: ${gameData.name}`);
        return true;
    } catch (error) {
        console.error('Error adding new game:', error);
        return false;
    }
}

// Function to add a new app to data-apps.js
function addNewApp(appData) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Read the current apps data
        const dataPath = path.join(__dirname, '../../data-apps.js');
        let content = fs.readFileSync(dataPath, 'utf8');
        
        // Extract the apps array
        const appsArrayStart = content.indexOf('const appsData = [');
        const appsArrayEnd = content.indexOf('];', appsArrayStart) + 1;
        const appsArrayText = content.substring(appsArrayStart, appsArrayEnd);
        
        // Create the new app entry
        const newAppEntry = `
    {
        id: "${appData.id}",
        name: "${appData.name}",
        url: "/a/${appData.id}.html",
        iframeUrl: "${appData.iframeUrl}",
        imageUrl: "${appData.imageUrl}",
        popular: ${appData.popular || false},
        new: ${appData.new || true},
        category: "${appData.category}"
    },`;
        
        // Insert the new app at the beginning of the array after the opening bracket
        const insertPosition = appsArrayText.indexOf('[') + 1;
        const updatedAppsArray = 
            appsArrayText.substring(0, insertPosition) + 
            newAppEntry + 
            appsArrayText.substring(insertPosition);
        
        // Replace the old apps array with the updated one
        const updatedContent = 
            content.substring(0, appsArrayStart) + 
            updatedAppsArray + 
            content.substring(appsArrayEnd);
        
        // Write the updated content back to the file
        fs.writeFileSync(dataPath, updatedContent);
        
        console.log(`Successfully added app: ${appData.name}`);
        return true;
    } catch (error) {
        console.error('Error adding new app:', error);
        return false;
    }
}

// Function to add a new movie to data-movies.js
function addNewMovie(movieData) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Read the current movies data
        const dataPath = path.join(__dirname, '../../data-movies.js');
        let content = fs.readFileSync(dataPath, 'utf8');
        
        // Extract the movies array
        const moviesArrayStart = content.indexOf('const moviesData = [');
        const moviesArrayEnd = content.indexOf('];', moviesArrayStart) + 1;
        const moviesArrayText = content.substring(moviesArrayStart, moviesArrayEnd);
        
        // Create the new movie entry
        const newMovieEntry = `
    {
        id: "${movieData.id}",
        name: "${movieData.name}",
        url: "/m/${movieData.id}.html",
        iframeUrl: "${movieData.iframeUrl}",
        imageUrl: "${movieData.imageUrl}",
        popular: ${movieData.popular || false},
        new: ${movieData.new || true},
        category: "${movieData.category}"
    },`;
        
        // Insert the new movie at the beginning of the array after the opening bracket
        const insertPosition = moviesArrayText.indexOf('[') + 1;
        const updatedMoviesArray = 
            moviesArrayText.substring(0, insertPosition) + 
            newMovieEntry + 
            moviesArrayText.substring(insertPosition);
        
        // Replace the old movies array with the updated one
        const updatedContent = 
            content.substring(0, moviesArrayStart) + 
            updatedMoviesArray + 
            content.substring(moviesArrayEnd);
        
        // Write the updated content back to the file
        fs.writeFileSync(dataPath, updatedContent);
        
        console.log(`Successfully added movie: ${movieData.name}`);
        return true;
    } catch (error) {
        console.error('Error adding new movie:', error);
        return false;
    }
}

// Function to check if content already exists
function contentExists(type, id) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        let dataPath;
        let searchString;
        
        switch(type) {
            case 'game':
                dataPath = path.join(__dirname, '../../data-games.js');
                searchString = `id: "${id}"`;
                break;
            case 'app':
                dataPath = path.join(__dirname, '../../data-apps.js');
                searchString = `id: "${id}"`;
                break;
            case 'movie':
                dataPath = path.join(__dirname, '../../data-movies.js');
                searchString = `id: "${id}"`;
                break;
            default:
                return false;
        }
        
        const content = fs.readFileSync(dataPath, 'utf8');
        return content.includes(searchString);
    } catch (error) {
        console.error(`Error checking if ${type} exists:`, error);
        return false;
    }
}

// Export the functions
module.exports = {
    addNewGame,
    addNewApp,
    addNewMovie,
    contentExists
}; 