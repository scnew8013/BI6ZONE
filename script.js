let premiumUsers = {
    "premiumUser1": "password1", // Replace with your premium user credentials
    "premiumUser2": "password2"
};

function openPopup() {
    document.getElementById("loginPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("loginPopup").style.display = "none";
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check against the premium user credentials
    if (premiumUsers[username] && premiumUsers[username] === password) {
        // Successful login for premium users
        localStorage.setItem("premium", "true"); // Store premium status
        alert("Login successful! You can skip wait times.");
        closePopup();
        // Load the game
        loadGame(0); // Load the game immediately
    } else {
        alert("Invalid username or password");
    }
}

function skipLogin() {
    // Allow free access without login
    alert("You can play without waiting, but premium features are limited.");
    closePopup();
    loadGame(0); // Load the game for free users
}

// Open the popup when the page loads or based on user action
window.onload = openPopup; // Adjust as needed to trigger

