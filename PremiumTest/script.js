// script.js
// Sample user accounts for demonstration
const accounts = {
    "premiumUser": "password123" // Example premium user
};

// Function to display the countdown
function startCountdown(duration) {
    let countdownElement = document.getElementById('countdown');
    countdownElement.style.display = 'block';
    let timer = duration, minutes, seconds;
    
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        countdownElement.textContent = `Wait for ${minutes} minute(s) and ${seconds} second(s) to play.`;
        
        if (--timer < 0) {
            clearInterval(interval);
            countdownElement.textContent = '';
            document.getElementById('play-button').style.display = 'block'; // Show play button after countdown
        }
    }, 1000);
}

// Login form submission handler
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const playButton = document.getElementById('play-button');
    const premiumFeatures = document.getElementById('premium-features');

    // Simple authentication check
    if (accounts[username] && accounts[username] === password) {
        messageElement.textContent = 'Login successful! Enjoy your premium features.';
        playButton.style.display = 'block';
        premiumFeatures.style.display = 'block'; // Show premium features
        startCountdown(10); // 10 seconds countdown
    } else {
        messageElement.textContent = 'Invalid username or password. Please try again.';
        playButton.style.display = 'none';
        premiumFeatures.style.display = 'none'; // Hide premium features
    }
});

