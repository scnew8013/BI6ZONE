// script.js

// Example premium users (you can expand this or pull from a backend in the future)
const premiumUsers = {
    'user1': 'password1', // Example user
    'user2': 'password2', // Add more users as needed
};

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    // Show the login form when the page loads
    document.getElementById('loginForm').style.display = 'block';

    document.getElementById('premiumLogin').onsubmit = function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (premiumUsers[username] && premiumUsers[username] === password) {
            alert('Logged in successfully! You can now skip ads.');
            localStorage.setItem('premium', 'true'); // Save premium status
            document.getElementById('loginForm').style.display = 'none'; // Hide the login form
        } else {
            alert('Invalid username or password.');
        }
    };

    // Skip button functionality for free users
    document.getElementById('skipButton').onclick = function () {
        alert('You are accessing the free version. Ads will be shown.');
        document.getElementById('loginForm').style.display = 'none'; // Hide the login form
    };
});
