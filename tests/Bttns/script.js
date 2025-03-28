// Adding unique animations for each navigation link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const animationType = link.getAttribute('data-animation');

            // Apply the unique animation class
            link.classList.add('animated', animationType);

            // Remove the animation class after the animation ends to allow re-triggering
            link.addEventListener('animationend', function() {
                link.classList.remove('animated', animationType);
            });

            // Redirect to the link after the animation
            setTimeout(() => {
                window.location.href = link.href; // Uncomment this to enable redirection
            }, 300); // Delay the redirection slightly to allow animation to play
        });
    });

    console.log('Enhanced navigation bar loaded successfully.');
});
