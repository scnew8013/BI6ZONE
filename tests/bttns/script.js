// script.js

// Function to add hover effects to navigation items
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.nav-link');

    // Loop through each link and add mouseover and mouseout events
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.classList.add('hover');
        });

        link.addEventListener('mouseout', () => {
            link.classList.remove('hover');
        });
    });
});
