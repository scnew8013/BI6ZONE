// Made By BI66IE619

// Optional: Interactive hover effect with smooth animations
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-5px)";
        item.style.transition = "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
        item.style.boxShadow = "0px 8px 20px rgba(255, 255, 255, 0.2)";
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0)";
        item.style.boxShadow = "none";
    });
});
