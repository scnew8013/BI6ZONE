// Add smooth hover effect when buttons are touched on mobile
document.querySelectorAll('.social-nav a').forEach(button => {
    button.addEventListener('touchstart', function() {
        this.style.transition = 'all var(--hover-speed) ease';
    });

    button.addEventListener('touchend', function() {
        this.style.transition = 'all var(--hover-speed) ease';
    });
});
