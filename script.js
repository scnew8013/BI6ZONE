// Function to show the loading screen and redirect after a delay
function redirectWithDelay(url) {
    // Show the loading screen
    document.getElementById('loading-screen').style.display = 'block';

    // Set a delay of 2-3 seconds before redirecting
    setTimeout(function() {
        window.location.href = url;
    }, 2000); // Change the value (in milliseconds) to adjust the delay
}

// Attach the redirectWithDelay function to links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior
        const url = this.getAttribute('href'); // Get the link URL
        redirectWithDelay(url); // Call the redirect function
    });
});
