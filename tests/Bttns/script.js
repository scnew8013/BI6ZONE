document.addEventListener('DOMContentLoaded', function() {
    const socialIcons = document.querySelectorAll('.social-icon');

    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.classList.add('hover');
        });

        icon.addEventListener('mouseleave', () => {
            icon.classList.remove('hover');
        });
    });
});