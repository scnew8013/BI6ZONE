document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
        });
    });

    // Scroll animation for portfolio cards
    const cards = document.querySelectorAll(".card");
    window.addEventListener("scroll", () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < window.innerHeight - 50) {
                card.style.transform = "translateY(0)";
                card.style.opacity = "1";
            }
        });
    });
});
